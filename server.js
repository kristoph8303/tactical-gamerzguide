import express from "express";
import cors from "cors";
import pg from "pg";
import { WebSocketServer } from "ws";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

if (!process.env.QWEN_API_KEY) {
  throw new Error("Missing QWEN_API_KEY");
}

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function computeState({
  timeToReward,
  payoutSlope,
  frictionDelta,
  reinvestEfficiency,
}) {
  const score =
    (timeToReward <= 2 ? 2 : timeToReward <= 5 ? 1 : timeToReward <= 10 ? -1 : -2) +
    (payoutSlope >= 1.5 ? 2 : payoutSlope >= 1 ? 1 : -1) +
    (frictionDelta <= 0.2 ? 2 : frictionDelta <= 0.5 ? 1 : -2) +
    (reinvestEfficiency >= 0.8 ? 2 : reinvestEfficiency >= 0.5 ? 1 : -1);

  if (score >= 5) return "EARLY";
  if (score >= 1) return "STABLE";
  if (score >= -2) return "DECAY";
  return "CLIFF";
}

function computeConfidence(metrics, telemetry = []) {
  const clarity =
    Math.abs(metrics.payoutSlope - 1) * 20 +
    Math.abs(metrics.frictionDelta - 0.25) * 30 +
    Math.abs(metrics.reinvestEfficiency - 0.5) * 30;

  const base = Math.min(70, 40 + clarity);
  const historyBoost = Math.min(25, telemetry.length * 5);

  return Math.min(98, Math.round(base + historyBoost));
}

function detectTrend(records) {
  if (records.length < 3) return null;

  const recent = records.slice(0, 3);

  if (recent.every(r => ["DECAY", "CLIFF"].includes(r.state))) {
    return "negative";
  }

  if (recent.every(r => ["EARLY", "STABLE"].includes(r.state))) {
    return "positive";
  }

  return "mixed";
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/engine", (req, res) => {
  try {
    const metrics = req.body;

    const state = computeState(metrics);
    const confidence = computeConfidence(
      metrics,
      metrics.telemetry || []
    );
    const trend = detectTrend(metrics.telemetry || []);

    res.json({
      state,
      confidence,
      trend,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Engine failure",
    });
  }
});

app.post("/api/run", async (req, res) => {
  try {
    const { systemPrompt, userPrompt } = req.body;

    if (!systemPrompt || !userPrompt) {
      return res.status(400).json({
        error: "Missing prompts",
      });
    }

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000);

    const response = await fetch(
      "https://api.qwen.ai/v1/chat/completions",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen-plus",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          temperature: 0.4,
        }),
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({
        error: "Qwen request failed",
      });
    }

    const data = await response.json();

    const text =
      data?.choices?.[0]?.message?.content || "";

    res.json({ text });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "AI layer failure",
    });
  }
});

app.post("/api/telemetry", async (req, res) => {
  try {
    const {
      id,
      timestamp,
      state,
      confidence,
      output,
    } = req.body;

    await pool.query(
      `
      INSERT INTO telemetry
      (id,timestamp,state,confidence,output)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (id) DO NOTHING
      `,
      [
        id,
        timestamp,
        state,
        confidence,
        output,
      ]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Telemetry insert failed",
    });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM telemetry
      ORDER BY timestamp DESC
      LIMIT 50
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "History query failed",
    });
  }
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Caddie running on ${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", ws => {
  ws.on("message", msg => {
    try {
      const event = JSON.parse(msg);

      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(event));
        }
      });
    } catch {
      console.log("Invalid websocket payload");
    }
  });
});
