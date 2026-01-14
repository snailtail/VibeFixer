# Quickstart: Persistent Backend Storage

## Goal

Verify session data survives backend restart and container recreation.

## Local Smoke Test

1. Create a data directory:

```bash
mkdir -p /Users/magnus/src/Work/VibeFixer/.data
```

2. Install backend dependencies:

```bash
cd /Users/magnus/src/Work/VibeFixer/backend
npm install
```

3. Start the backend with a local SQLite path:

```bash
VIBEFIXER_DB_PATH=/Users/magnus/src/Work/VibeFixer/.data/vibefixer.sqlite node /Users/magnus/src/Work/VibeFixer/backend/src/server.js
```

4. Start a session and end it:

```bash
curl -X POST http://localhost:3000/api/sessions
curl http://localhost:3000/api/sessions/stats
```

5. Restart the backend and re-check stats:

```bash
curl http://localhost:3000/api/sessions/stats
```

Expected: counts and latest completion time remain intact.

## Container Recreation Test

1. Deploy to the server with the host volume configured.
2. Remove and recreate the container.
3. Confirm stats persist via `/api/sessions/stats`.
