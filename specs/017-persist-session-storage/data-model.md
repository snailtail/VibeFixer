# Data Model: Persistent Backend Storage

## Entities

### Session

- **id**: unique session identifier
- **seed**: level generation seed
- **started_at**: timestamp when session was created
- **ended_at**: timestamp when session ended (nullable)
- **duration_seconds**: intended session duration
- **status**: active | ended
- **result**: won | lost | abandoned (nullable)
- **score**: current score
- **remaining_artifact_count**: count of artifacts not deposited
- **terrain**: serialized terrain data
- **trash_can**: serialized trash can bounds/position
- **artifacts**: serialized artifact list with status

### SessionStats

- **active_count**: number of active sessions
- **started_count**: total sessions started
- **ended_count**: total sessions ended
- **stale_ended_count**: auto-ended session count
- **won_count**: won sessions
- **lost_count**: lost sessions
- **abandoned_count**: abandoned sessions
- **latest_completed_at**: timestamp of most recent completion

### SystemStats

- **started_at**: backend start timestamp

## Relationships

- SessionStats aggregates values derived from Session records.
- SystemStats is a singleton record for runtime metadata.

## Lifecycle

- Session created → active
- Session ends → ended + result assigned
- Stale sessions → ended with result abandoned
- Stats derived and updated on session lifecycle changes

