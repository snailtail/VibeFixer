# Research: FOMO Demon, Cast, and Event Log

## Decision 1: Client-side FOMO Demon state

- **Decision**: Compute the FOMO Demon state in the client based on end-of-round counts.
- **Rationale**: Avoids adding backend endpoints and keeps feedback immediate.
- **Alternatives considered**: Server-side computation; rejected to reduce scope.

## Decision 2: Bounded event log

- **Decision**: Keep a fixed-length event log list in memory and render it beside the canvas.
- **Rationale**: Ensures readability without overwhelming the UI.
- **Alternatives considered**: Unlimited log; rejected due to clutter.
