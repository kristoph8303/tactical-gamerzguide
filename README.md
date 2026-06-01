# Caddie Platform

Deterministic offer optimizer with telemetry, trend detection, PostgreSQL persistence, Qwen integration, and Fly.io deployment.

## Environment Variables

- DATABASE_URL
- QWEN_API_KEY
- PORT

## Local Run

```bash
npm install
npm start
```

## Database

Run schema.sql before starting the server:

```bash
psql -f schema.sql
```

## Health Check

```bash
GET /health
```

## API Endpoints

### Engine
- `POST /api/engine` - Compute state and confidence metrics

### AI
- `POST /api/run` - Run Qwen AI with custom prompts

### Telemetry
- `POST /api/telemetry` - Log telemetry data
- `GET /api/history` - Retrieve last 50 telemetry records

### WebSocket
- `ws://localhost:8080` - Real-time event broadcasting

## Deployment with Fly.io

1. Install Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
2. Authenticate: `flyctl auth login`
3. Deploy: `flyctl deploy`

## License

ISC
