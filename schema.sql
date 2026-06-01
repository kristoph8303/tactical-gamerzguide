CREATE TABLE telemetry (
    id TEXT PRIMARY KEY,
    timestamp BIGINT,
    state TEXT,
    confidence INT,
    output TEXT
);

CREATE INDEX telemetry_timestamp_idx
ON telemetry(timestamp DESC);
