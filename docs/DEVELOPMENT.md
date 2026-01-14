# Development Guide

## Overview

This guide explains how to develop, maintain, and deploy VibeFixer. The frontend is served by the backend; there is no separate frontend server.

## Local Development

### Prerequisites

- Node.js 20+
- Git

### Run the app locally

1. Install backend dependencies:

```bash
cd /Users/magnus/src/Work/VibeFixer/backend
npm install
```

2. Start the backend:

```bash
VIBEFIXER_DB_PATH=/Users/magnus/src/Work/VibeFixer/.data/vibefixer.sqlite node /Users/magnus/src/Work/VibeFixer/backend/src/server.js
```

3. Open the game in a browser at:

```
http://localhost:3000
```

The backend serves the frontend assets directly.
Session stats are available at `http://localhost:3000/api/sessions/stats`.
System stats are available at `http://localhost:3000/api/system/stats`.

## Persistence Notes

- Docker uses a named volume `vibefixer-data` mounted at `/data` inside the container.
- The database file path is controlled by `VIBEFIXER_DB_PATH`.

## Adding Features or Fixing Bugs

1. Create a new feature branch (or use `/speckit.specify` if you follow the spec workflow).
2. Implement changes in `frontend/` or `backend/` as needed.
3. Update documentation when endpoints or runtime flows change.
4. Test locally (manual smoke test).
5. Open a PR to `main`.

## Dependency & Maintenance Plan

### Quarterly maintenance (recommended)

- Update Node.js to the latest LTS (currently 20.x).
- Update Docker Engine and Docker Compose on the server.
- Review GitHub Actions logs for deprecation warnings.

### When updating dependencies

- Re-test locally after upgrading Node.js.
- Rebuild and deploy to production via the GitHub Actions pipeline.

## Deployment to Ubuntu Server

Deployment is automated via GitHub Actions:

- Workflow: `.github/workflows/deploy.yml`
- Trigger: push to `main`
- Target: `~/vibefixerapp` on the server

### Manual redeploy (if needed)

SSH into the server and run:

```bash
cd ~/vibefixerapp
DOCKER_BUILDKIT=0 docker build -t vibefixerapp:latest .
docker-compose up -d --no-build
```

## Documentation Updates

- Update `README.md` when architecture, API, or deployment changes.
- Keep API reference in sync with `backend/src/api/sessions.js`.
- If session stats or outcomes change, update the stats response example.
- If system stats change, update the system stats response example.
