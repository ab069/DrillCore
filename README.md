# DrillCore — Drilling Operations Analytics

Oil & gas drilling operations analytics platform with ROP analysis, mud pressure monitoring, risk scoring, and real-time alerts.

## Quick Start

```bash
docker compose up -d
```

Open http://localhost — register an account and start tracking rigs.

## Features

- **Rig Tracking** — manage drilling rigs with type, depth, status
- **ROP Analysis** — rate of penetration efficiency with recommendations
- **Mud Pressure Monitoring** — checks mud weight against formation pressure
- **Bit Wear Analysis** — bit condition tracking and replacement alerts
- **Risk Scoring** — 0-100 composite risk score with drill reports
- **Real-Time Alerts** — WebSocket-powered alert feed for critical events

## Architecture

- **Backend**: FastAPI + SQLAlchemy (async) + PostgreSQL 16
- **Frontend**: React 18 + TypeScript + Zustand + Recharts + Vite
- **Auth**: JWT (python-jose) with bcrypt password hashing
- **Real-Time**: WebSocket for live analysis and alerts
- **Deployment**: Docker Compose (backend, frontend, postgres)

## API Endpoints

| Method | Path               | Description         |
|--------|--------------------|---------------------|
| POST   | /api/auth/register | Register user       |
| POST   | /api/auth/login    | Login               |
| GET    | /api/rigs/         | List rigs           |
| POST   | /api/rigs/         | Create rig          |
| GET    | /api/rigs/stats    | Rig statistics      |
| GET    | /api/rigs/:id      | Get rig             |
| PUT    | /api/rigs/:id      | Update rig          |
| DELETE | /api/rigs/:id      | Delete rig          |
| GET    | /api/alerts/       | List alerts         |
| GET    | /api/alerts/stats  | Alert statistics    |
| PATCH  | /api/alerts/:id/status | Update alert status |
| WS     | /ws/:user_id       | WebSocket           |

## License

MIT
