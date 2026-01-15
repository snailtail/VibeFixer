# Development Guide

## Overview

This guide explains how to develop, maintain, and deploy VibeFixer. The frontend is served by the backend; there is no separate frontend server.

## Local Development

### Prerequisites

- Node.js 20+
- Git
- Docker (optional, for Docker Compose)

### Clone the repo

```bash
git clone <repo-url> vibefixer
cd vibefixer
```

### Run the app locally (Node.js)

1. Create a local data directory:

```bash
mkdir -p .data
```

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Start the backend:

```bash
PORT=3333 VIBEFIXER_DB_PATH=./.data/vibefixer.sqlite node ./backend/src/server.js
```

3. Open the game in a browser at:

```
http://localhost:3333
```

The backend serves the frontend assets directly.
Session stats are available at `http://localhost:3333/api/sessions/stats`.
System stats are available at `http://localhost:3333/api/system/stats`.

### Run the app locally (Docker Compose)

1. Set admin credentials (shell env or `.env` file):

```bash
export ADMIN_USER=admin
export ADMIN_PASSWORD=change-me
```

2. Build and run:

```bash
docker compose up --build
```

3. Open the game in a browser at:

```
http://localhost:3333
```

## Persistence Notes

- Docker uses a named volume `vibefixer-data` mounted at `/data` inside the container.
- The database file path is controlled by `VIBEFIXER_DB_PATH`.

## Adding Features or Fixing Bugs

1. Create a new feature branch (or use `/speckit.specify` if you follow the spec workflow).
2. Implement changes in `frontend/` or `backend/` as needed.
3. Update documentation when endpoints or runtime flows change.
4. Test locally (manual smoke test).
5. Open a PR to `main`.

## Spec-kit workflow (Codex CLI)

If you use Codex CLI with the spec-kit workflow:

1. Start Codex CLI in the repo root.
2. Run `/speckit.specify` to scaffold a new spec in `specs/`.
3. Run `/speckit.plan` to generate the plan and supporting docs.
4. Run `/speckit.tasks` to create the task list for implementation.

Optional: run `.specify/scripts/bash/update-agent-context.sh` if you want to sync
the spec-kit rules into other supported editors.

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
- Keep API reference in sync with `backend/src/api/sessions.js` and `backend/src/api/high-scores.js`.
- If session stats or outcomes change, update the stats response example.
- If system stats change, update the system stats response example.

## Security Maintenance

- Run `npm audit --omit=dev` in `backend/` after dependency updates.
- Keep `backend/package-lock.json` committed and updated with dependency changes.
- CI security audit runs via `.github/workflows/security-audit.yml`.
