# Caddie

Caddie is a telemetry-driven game loop analysis platform designed to help players evaluate progression systems, reward cycles, and time efficiency inside games.

Rather than chasing the biggest rewards, Caddie focuses on identifying the best return on time invested. It analyzes player inputs, classifies loop health, tracks historical patterns, and generates actionable guidance through a combination of deterministic evaluation and AI-assisted interpretation.

## Core Philosophy

Most games contain progression loops:

- Complete actions
- Receive rewards
- Reinvest resources
- Repeat

Some loops compound efficiently.

Others gradually slow down, increase friction, and deliver diminishing returns.

Caddie helps identify the difference.

## Features

### Loop State Classification

Every evaluation is classified into one of four states:

| State | Meaning |
|-------|---------|
| EARLY | Strong opportunity. Rewards justify investment. |
| STABLE | Healthy progression. Continue current strategy. |
| DECAY | Returns are slowing. Monitor closely. |
| CLIFF | Additional effort is unlikely to improve outcomes. |

### Confidence Scoring

Caddie generates a confidence signal based on:

- Reward timing
- Payout growth
- Friction increase
- Reinvestment efficiency
- Historical telemetry

This allows guidance to become stronger as more data is collected.

### Trend Detection

Telemetry history is analyzed to identify:

- Trending Up
- Trending Down
- Mixed Signal

This helps distinguish temporary fluctuations from longer-term patterns.

### Persistent Telemetry

Historical reads are stored and can be reviewed over time.

Telemetry records include:

- Timestamp
- State
- Confidence
- Generated guidance

### AI-Assisted Guidance

Qwen generates natural-language recommendations using:

- Current loop state
- Confidence score
- Trend information
- Historical telemetry context

The AI explains what the engine sees and suggests practical next actions.

### Real-Time Updates

WebSocket support enables:

- Live telemetry streaming
- Multi-client synchronization
- Future collaborative and community features

## Architecture

### Frontend

- React
- Local telemetry visualization
- State indicators
- Confidence displays
- Trend graphs

### Backend

- Node.js
- Express
- PostgreSQL
- WebSocket Server

### AI Layer

- Qwen Plus

### Infrastructure

- Docker
- Fly.io

## API Endpoints

### POST /api/engine

Evaluates loop metrics and returns:

- State
- Confidence
- Trend

### POST /api/run

Generates AI guidance using Qwen.

### POST /api/telemetry

Stores telemetry records.

### GET /api/history

Returns recent telemetry history.

## Database Schema

Telemetry records include:

- ID
- Timestamp
- State
- Confidence
- Output

## Deployment

Designed for deployment on:

- Fly.io
- Docker containers
- Managed PostgreSQL providers

## Project Status

Caddie is currently focused on game-loop evaluation and decision support.

Future development may include:

- Expanded telemetry models
- Community signal aggregation
- Comparative loop analysis
- Personalized player profiles
- Cross-game optimization tools

## License

Private project. All rights reserved.
