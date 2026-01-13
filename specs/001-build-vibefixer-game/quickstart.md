# Quickstart: VibeFixer Platformer

## Prerequisites

- Node.js 20+
- A reverse proxy configured to forward HTTP requests to the game server

## Local Development

1. Install dependencies if needed (Node.js 20+).
2. Start the backend server: `node backend/src/server.js`.
3. Open `http://localhost:3000/` in a modern desktop browser.

## Running a Session

1. Press Space to start the round.
2. Use left/right arrows to move, up arrow to jump, and space to pick up or drop artifacts (pickup works within ~15px).
3. Collect dropped artifacts and deposit them at the trash can to reduce the ground-count score.
4. When the 60-second timer ends, reload the page to start a new round.

## Smoke Tests

- Start a new session and verify terrain and artifact placements differ across restarts.
- Pick up and deposit an artifact and confirm the score increases by its value.
- Allow the timer to expire and confirm the session ends.
