# VibeFixer — Technical Documentation

## Purpose

VibeFixer is a browser-based arcade game with a lightweight Node.js backend. This README explains how the system runs, what components exist, and how they communicate so a system technician can operate and maintain the service.

## System Overview

### Components

- **Frontend (Browser)**: Static HTML, vanilla ES2022 JS, and assets rendered in the browser.
- **Backend (Node.js)**: Node.js 20 server using built-in HTTP and `better-sqlite3` for persistence.
- **Deployment (GitHub Actions + SSH)**: Pushes updated code to the Ubuntu server and restarts Docker services.
- **Docker Runtime**: Runs the backend service on the server.
- **Reverse Proxy (Caddy/Cloudflare)**: Terminates TLS and routes traffic to the backend on port 3333 (managed separately).

### Runtime Locations

- **Frontend assets**: `/frontend/` (served by the backend at runtime).
- **Backend server**: `/backend/src/server.js`.
- **Deployment workflow**: `.github/workflows/deploy.yml`.
- **Docker configuration**: `Dockerfile`, `docker-compose.yml`.

## Responsibilities & Communication Flow

1. **Client loads game**
   - Browser requests `/` from the backend.
   - Backend serves `frontend/index.html` and static assets under `/frontend`.

2. **Game starts a session**
   - When the player presses the action key to start, the frontend calls `POST /api/sessions`.
   - Backend generates a session with terrain and returns session data.

3. **Gameplay updates**
   - Frontend sends API requests to create artifacts, update artifact status, deposit code, and end sessions.
   - Backend updates session state in the SQLite-backed store and returns responses.

4. **Session stats**
   - Frontend polls `GET /api/sessions/stats` to display active session totals and outcomes.

5. **High scores**
   - After a won/lost game, the frontend optionally posts a gamer tag to `POST /api/high-scores`.
   - The high score list is read from `GET /api/high-scores` and rendered above the credits.

6. **Security controls**
   - Write endpoints are rate-limited to 600 requests/minute per IP.
   - Requests over 100 KB are rejected with a safe error response.
   - Responses include baseline security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
   - Completed sessions are retained for 30 days; high scores for 180 days.

7. **Deployment updates**
   - On pushes to `main`, GitHub Actions syncs the repo to `~/vibefixerapp`.
   - Docker rebuilds and runs the backend, exposing port 3333.

## Networking & Ports

- **Backend**: Listens on port `3333` in production (via `PORT` env var).
- **Frontend**: Served through the backend (no separate frontend server).
- **Reverse proxy**: Routes the public domain to `http://localhost:3333` on the server.

## API Reference

Base URL: `https://<your-domain>` (proxied to backend)

### Create session

`POST /api/sessions`

**Request body (optional)**:

```json
{
  "requestedDurationSeconds": 60
}
```

**Response** `201`:

```json
{
  "sessionId": "session_...",
  "seed": "...",
  "durationSeconds": 60,
  "score": 0,
  "artifacts": [
    { "id": "artifact_...", "position": { "x": 0, "y": 0 }, "status": "ground" }
  ],
  "terrain": [ { "id": "terrain_...", "type": "ground", "bounds": { "x": 0, "y": 0, "width": 1024, "height": 100 } } ],
  "trashCan": { "position": { "x": 0, "y": 0 }, "bounds": { "x": 0, "y": 0, "width": 90, "height": 110 } }
}
```

### Deposit artifact

`POST /api/sessions/{sessionId}/deposit`

**Request body**:

```json
{ "artifactId": "artifact_..." }
```

**Response** `200`:

```json
{ "score": 0, "remainingArtifacts": 0 }
```

### End session

`POST /api/sessions/{sessionId}/end`

**Request body (optional)**:

```json
{ "result": "won" }
```

`result` may be `won` or `lost`. Missing/invalid values are treated as abandoned.

**Response** `200`:

```json
{ "finalScore": 0, "artifactsDeposited": 0 }
```

### Spawn artifact

`POST /api/sessions/{sessionId}/spawn`

**Request body**:

```json
{ "x": 100, "y": 200 }
```

**Response** `201`:

```json
{ "artifact": { "id": "artifact_...", "position": { "x": 100, "y": 200 }, "status": "inAir" } }
```

### Update artifact status

`POST /api/sessions/{sessionId}/artifact-status`

**Request body**:

```json
{ "artifactId": "artifact_...", "status": "ground" }
```

**Response** `200`:

```json
{ "ok": true }
```

### Session stats

`GET /api/sessions/stats`

**Response** `200`:

```json
{
  "activeCount": 0,
  "startedCount": 0,
  "endedCount": 0,
  "staleEndedCount": 0,
  "wonCount": 0,
  "lostCount": 0,
  "abandonedCount": 0,
  "latestCompletedAt": "2026-01-14T12:34:56.000Z"
}
```

`latestCompletedAt` only updates for completed games (`won` or `lost`).

### Admin authentication

`POST /api/admin/login`

**Request body**:

```json
{ "username": "admin", "password": "secret" }
```

**Response** `200`:

```json
{ "expiresAt": "2026-01-14T12:34:56.000Z" }
```

Sets an HTTP-only admin session cookie (30-minute TTL).

`POST /api/admin/logout`

**Response** `200`:

```json
{ "ok": true }
```

### Admin logs

`GET /api/admin/logs?start=...&end=...&category=security&severity=high&q=...&limit=200`

**Response** `200`:

```json
{ "logs": [] }
```

`GET /api/admin/logs/export` returns the same payload with a JSON attachment header.
When no filters are provided, the API returns up to the default limit of logs.

### Admin high scores

`GET /api/admin/high-scores`

**Response** `200`:

```json
{ "scores": [] }
```

`PATCH /api/admin/high-scores/{id}` updates `playerTag`, `result`, or `remainingUnchecked`.

`DELETE /api/admin/high-scores/{id}` removes the entry.

### Admin notices

`GET /api/admin/notices`

`POST /api/admin/notices`

**Request body**:

```json
{
  "message": "Maintenance window",
  "validFrom": "2026-01-14T12:00:00.000Z",
  "validTo": "2026-01-14T13:00:00.000Z"
}
```

`PATCH /api/admin/notices/{id}` updates the message/time window.

`DELETE /api/admin/notices/{id}` removes the notice.

### Admin game settings

`GET /api/admin/game-settings`

**Response** `200`:

```json
{ "settings": { "playerSpeedPercent": 100 } }
```

`PUT /api/admin/game-settings`

**Request body**:

```json
{ "playerSpeedPercent": 120 }
```

### Active notices

`GET /api/notices/active`

**Response** `200`:

```json
{ "notices": [] }
```

### Security behavior

- Write endpoints enforce 600 requests/minute per IP.
- Request bodies over 100 KB return `413 Payload Too Large`.
- Validation failures return `400` with a safe JSON error.
- Automated dependency audits run on every main-branch update and weekly.
- Admin endpoints require an authenticated admin session cookie.

### Admin console

- Admin access starts at `/admin/login` and uses a 30-minute session cookie.
- Admin sections live at `/admin/logs`, `/admin/high-scores`, `/admin/notices`, and `/admin/game-settings`.
- Set `ADMIN_USER` and `ADMIN_PASSWORD` environment variables in deployment.
- Logs include security and gameplay events (default limit 200 unless overridden).
- Repeated failed login attempts are temporarily blocked to slow brute-force attempts.

### System stats

`GET /api/system/stats`

**Response** `200`:

```json
{
  "startedAt": "2026-01-14T12:00:00.000Z",
  "uptimeSeconds": 12345,
  "sessionsStarted": 0,
  "sessionsActive": 0,
  "sessionsEnded": 0,
  "latestActivityAt": "2026-01-14T12:34:56.000Z",
  "serverVersion": "0.78.0217"
}
```

### High scores

`GET /api/high-scores`

**Response** `200`:

```json
{
  "scores": [
    {
      "id": 1,
      "createdAt": "2026-01-14T12:34:56.000Z",
      "playerTag": "VibeFixer",
      "result": "won",
      "remainingUnchecked": 0
    }
  ]
}
```

`POST /api/high-scores`

**Request body**:

```json
{
  "playerTag": "VibeFixer",
  "result": "won",
  "remainingUnchecked": 0
}
```

**Response** `201`:

```json
{
  "score": {
    "id": 1,
    "createdAt": "2026-01-14T12:34:56.000Z",
    "playerTag": "VibeFixer",
    "result": "won",
    "remainingUnchecked": 0
  }
}
```

### Health check

`GET /health`

**Response** `200`:

```json
{ "status": "ok" }
```

## Deployment (Ubuntu Server)

Deployment is handled by GitHub Actions using SSH secrets and Docker.

**Workflow**: `.github/workflows/deploy.yml`

**Overview**:

1. Sync repository to `~/vibefixerapp` on the server.
2. Build Docker image (`vibefixerapp:latest`).
3. Start container using `docker-compose up -d --no-build`.

**Runtime port**: `3333` (exposed by Docker).

## Persistence

Session and stats data are stored in a SQLite file on a Docker volume (`vibefixer-data`) mounted at `/data`. The DB path is configured with `VIBEFIXER_DB_PATH` and defaults to `/data/vibefixer.sqlite` in production.

## Development Guide

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for:

- Local development instructions
- Adding features and fixing bugs
- Maintenance and dependency updates
- How to deploy updates to the Ubuntu server

## Maintenance Plan (Summary)

- Review dependency updates quarterly (Node.js 20 LTS, Docker updates).
- Run the full deployment pipeline after updates to keep production in sync.
- Update API reference in README when endpoints change.

## Troubleshooting

- If the backend is unreachable, confirm Docker is running and port `3333` is open.
- If deployment fails, check GitHub Actions logs and verify SSH secrets.

## Static Assets

- Frontend static assets live under `frontend/` and `frontend/src/assets/`.
- Assets are served directly by the backend from the `frontend/` directory.
