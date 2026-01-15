# VibeFixer Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-13

## Active Technologies
- Lightweight persistent store for leaderboard entries (002-add-highscores)
- In-memory session state (no persistence) (003-add-second-villain)
- JavaScript (Node.js 20+ for backend, ES modules in browser) + None (vanilla JS, Node.js built-ins) (005-randomize-coder-drops)
- JavaScript (ES2022) for client; Node.js 20+ for server + None (vanilla JS, Node.js built-ins) (008-deploy-ssh-action)
- In-memory session store (no external DB) (008-deploy-ssh-action)
- Node.js 20 (current runtime) + SQLite driver for Node.js (selected in research), existing Node HTTP server (017-persist-session-storage)
- SQLite database file on a host-mounted volume (017-persist-session-storage)
- JavaScript (Node.js 20) + Node.js built-in HTTP server; better-sqlite3 (existing) (018-security-hardening)
- SQLite for sessions/high scores (existing) (018-security-hardening)
- JavaScript (Node.js 20.x) + Node.js standard library, `better-sqlite3` for storage (019-owasp-hardening)
- SQLite database on persistent volume (019-owasp-hardening)
- JavaScript (ES2022) for client, Node.js 20 for server + None (vanilla JS, Node.js standard library) (027-background-switch)
- Local device preference (client-side) (027-background-switch)

- JavaScript (ES2022) for client; Node.js 20 for server + Minimal HTTP server framework; browser Canvas 2D rendering (001-build-vibefixer-game)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

JavaScript (ES2022) for client; Node.js 20 for server: Follow standard conventions

## Recent Changes
- 027-background-switch: Added JavaScript (ES2022) for client, Node.js 20 for server + None (vanilla JS, Node.js standard library)
- 027-background-switch: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]
- 021-admin-console: Added JavaScript (Node.js 20.x) + Node.js standard library, `better-sqlite3` for storage


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
