# Quickstart: Automated SSH Deployment

## Local Development (unchanged)

- Prerequisite: Node.js 20+
- Start backend: `node /Users/magnus/src/Work/VibeFixer/backend/src/server.js`
- Open `frontend/index.html` via the backend server (served at `/`).

## Deployment Verification (after pipeline runs)

1. Confirm the GitHub Action completes without errors.
2. Verify the backend is listening on port 3333 on the server.
3. Load the public URL through Caddy/Cloudflare and confirm the game starts.
