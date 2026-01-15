# Data Model: Active Session List

## Entity: ActiveSessionSummary

**Purpose**: Summarizes a live session for admin monitoring.

**Fields**:
- `sessionId` (string): Unique identifier for the session.
- `status` (string): Current session status (e.g., active, ending, stale).
- `startedAt` (timestamp): Session start time.
- `elapsedSeconds` (number): Seconds since start time.
- `score` (number): Current score.
- `remainingArtifacts` (number): Remaining artifacts/items to complete.
- `playerSpeedPercent` (number): Current player speed modifier.

**Validation Rules**:
- `sessionId` is required and non-empty.
- `elapsedSeconds` is non-negative.
- `score` and `remainingArtifacts` are zero or greater.
- `playerSpeedPercent` is a positive number.

**Relationships**:
- Derived from the live session store; no new persistence required.

**State Transitions**:
- `active` -> `ending` or `stale` when the session finishes or times out.
- Removed from the active list when the session ends.
