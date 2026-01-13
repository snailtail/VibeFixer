# Quickstart: Imp Ediment Obstacles

## Prerequisites

- Node.js 20+

## Local Development

1. Start the backend server: `node /Users/magnus/src/Work/VibeFixer/backend/src/server.js`.
2. Open `http://localhost:3000/` in a modern desktop browser.

## Smoke Tests

- Run a round past 10 seconds and confirm Imp Ediment appears and places 1–5 obstacles within 2 seconds.
- Confirm new obstacles never overlap the player, trash can, artifacts, or existing obstacles.
- Run multiple rounds and confirm the second appearance sometimes occurs after 40 seconds with the toast message.
- Confirm the whooshing sound plays each time Imp Ediment appears.
