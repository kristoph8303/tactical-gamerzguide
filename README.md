# Caddie Platform

A offer optimizer with AI-powered insights and real-time telemetry.

## Features

- Express.js REST API
- WebSocket support for real-time events
- PostgreSQL telemetry storage
- Qwen AI integration for intelligent analysis
- CORS enabled
- Health check endpoint

## Setup

### Environment Variables

Create a `.env` file with:

```
DATABASE_URL=postgresql://user:password@host:port/database
QWEN_API_KEY=your-qwen-api-key
PORT=8080
```

### Local Development

```bash
npm install
npm start
```

### Database Setup

Run the schema file to set up the database:

```bash
psql -f schema.sql
```

Or manually create the table:

```sql
CREATE TABLE telemetry (
    id TEXT PRIMARY KEY,
    timestamp BIGINT,
    state TEXT,
    confidence INT,
    output TEXT
);

CREATE INDEX telemetry_timestamp_idx
ON telemetry(timestamp DESC);
```

### Deployment with Fly.io

1. Install Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
2. Authenticate: `flyctl auth login`
3. Launch app: `flyctl launch`
4. Set secrets:
   ```bash
   flyctl secrets set DATABASE_URL=postgresql://...
   flyctl secrets set QWEN_API_KEY=your-api-key
   ```
5. Deploy: `flyctl deploy`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Engine
- `POST /api/engine` - Compute state and confidence metrics

### AI
- `POST /api/run` - Run Qwen AI with custom prompts

### Telemetry
- `POST /api/telemetry` - Log telemetry data
- `GET /api/history` - Retrieve last 50 telemetry records

### WebSocket
- `ws://localhost:8080` - Real-time event broadcasting

## License

ISC
