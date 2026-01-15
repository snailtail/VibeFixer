# Data Model: Sessions Today Count

## Session

**Represents**: A user interaction period with a recorded start time.

**Key Fields**:
- id: Unique identifier for the session.
- status: Current session lifecycle state.
- started_at: Timestamp for when the session began (used to determine "today").
- ended_at: Timestamp for when the session ended, if applicable.
- result: Outcome classification when completed, if applicable.

**Relationships**:
- None required for this feature.

**Validation Rules**:
- started_at is required and must be a valid timestamp.
