# Quickstart: Randomized Coder Drops

## Prerequisites

- Node.js 20+

## Local Development

1. Start the backend server: `node /Users/magnus/src/Work/VibeFixer/backend/src/server.js`.
2. Open `http://localhost:3000/` in a modern desktop browser.

## Smoke Tests

- Start a round, note the coder spawn X position, reload, and confirm a different spawn position appears.
- Start multiple rounds and confirm the first coder sometimes starts moving left and sometimes right.
- Observe the second coder appearing and confirm its spawn time varies slightly between rounds.
- Observe a coder during a round and confirm its speed changes at least once.
- Observe drops and confirm each drop occurs at the coder’s current position and remains within the play area.
