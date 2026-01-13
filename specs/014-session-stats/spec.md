# Feature Specification: Active Session Stats and Cleanup

**Feature Branch**: `014-session-stats`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "Could we keep track of active sessions on the backend- so it could be displayed by the frontend? Some stats? And if an active session does not end in lets say twice the time a game takes (currently 60 seconds I guess) the backend could end that session by itself to save resources, and also keep a more current track of actual active sessions?"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - View Session Stats (Priority: P1)

As a player or operator, I want to see active session counts and outcomes so I can understand current activity and game results.

**Why this priority**: Visibility into active sessions is the primary requested outcome.

**Independent Test**: Trigger multiple sessions with different outcomes and verify the frontend displays active counts and win/loss/abandon stats.

**Acceptance Scenarios**:

1. **Given** one active session, **When** the stats are viewed, **Then** the active session count is 1.
2. **Given** multiple completed sessions, **When** the stats are viewed, **Then** the win, loss, and abandon counts reflect those outcomes.

---

### User Story 2 - Auto-End Stale Sessions (Priority: P2)

As a system operator, I want stale sessions to be ended automatically after an inactivity threshold so resources are reclaimed and stats stay current.

**Why this priority**: Prevents runaway session growth and keeps active counts accurate.

**Independent Test**: Create a session, simulate no activity for the threshold window, and verify it is removed from active stats.

**Acceptance Scenarios**:

1. **Given** a session that exceeds the stale threshold, **When** cleanup runs, **Then** the session is ended and removed from the active list.
2. **Given** an active session under the threshold, **When** cleanup runs, **Then** it remains active.

### Edge Cases

- Sessions that end normally should be removed from stats immediately.
- Sessions without end events should still be cleaned up after the threshold.
- Stats should remain accurate if no sessions are active (count = 0).
- If the frontend ends a session without a result, it should be counted as abandoned.

### Assumptions & Dependencies

- Assumes game duration is available to determine the stale threshold (2x duration).
- Assumes frontend can call an API endpoint to fetch session stats.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST track active sessions and expose a summary for the frontend.
- **FR-002**: The summary MUST include active sessions and outcome stats (wins, losses, abandoned).  
- **FR-003**: The backend MUST automatically end sessions that exceed twice the game duration without a normal end event.
- **FR-004**: When a session ends (normal or auto-end), it MUST be removed from active session stats.
- **FR-005**: The frontend MUST display the active session stats in a visible location.

### Key Entities *(include if feature involves data)*

- **Session Summary**: Aggregated counts of active and ended sessions, derived from current session data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Active session stats render within 1 second of page load.
- **SC-002**: Sessions exceeding the stale threshold are removed from active stats within 1 minute.
- **SC-003**: Active session count matches the number of live sessions in manual QA tests.
- **SC-004**: When no sessions are active, the summary reports zero active sessions.
- **SC-005**: Win, loss, and abandoned counts match completed session outcomes in manual QA tests.
