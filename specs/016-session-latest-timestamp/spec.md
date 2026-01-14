# Feature Specification: Latest Session Completion Timestamp

**Feature Branch**: `016-session-latest-timestamp`  
**Created**: 2026-01-14  
**Status**: Draft  
**Input**: User description: "I would like to save the timestamp for the latest completed session - well still keep it in memory only, so itll reset after restart of the container/backend but that is fine for now. If it is not too much,"

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

### User Story 1 - View Latest Completion Time (Priority: P1)

As a player or operator, I want to see when the most recent session completed so I can understand current activity at a glance.

**Why this priority**: This is the primary requested data point and directly supports monitoring.

**Independent Test**: End a session and verify the latest completion timestamp updates and is visible.

**Acceptance Scenarios**:

1. **Given** at least one session has ended, **When** stats are displayed, **Then** the latest completion timestamp matches the most recent session end time.
2. **Given** the backend restarts, **When** stats are displayed, **Then** the latest completion timestamp is empty or reset.

---

### User Story 2 - View Backend Start Time (Priority: P2)

As a system operator, I want to see when the backend started so I can correlate uptime with session activity.

**Why this priority**: This provides system context and supports future system stats.

**Independent Test**: Restart the backend and confirm the start time changes and is shown.

**Acceptance Scenarios**:

1. **Given** the backend restarts, **When** system stats are requested, **Then** the backend start time reflects the new start time.

---

### User Story 3 - Keep Stats In Memory Only (Priority: P3)

As a system operator, I want the latest completion timestamp stored in memory only so it resets on backend restart without requiring a database.

**Why this priority**: Matches the desired lightweight, ephemeral storage.

**Independent Test**: Restart the backend and confirm the timestamp clears.

**Acceptance Scenarios**:

1. **Given** the backend restarts, **When** stats are requested, **Then** the latest completion timestamp is not persisted.

### Edge Cases

- If no sessions have ended, the latest completion timestamp should be null/empty.
- If multiple sessions end quickly, the latest timestamp should reflect the most recent end.
- Backend start time should change after a restart.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: The backend MUST track the timestamp of the latest completed session in memory.
- **FR-002**: The timestamp MUST update when a session ends normally or via automatic cleanup.
- **FR-003**: The session stats response MUST include the latest completion timestamp.
- **FR-004**: The backend MUST expose system stats that include the backend start time.
- **FR-005**: The frontend MUST display the latest completion timestamp and backend start time in separate sections.
- **FR-006**: The timestamp MUST reset when the backend restarts.

### Key Entities *(include if feature involves data)*

- **Latest Completion Timestamp**: The most recent session end time stored in memory.
- **Backend Start Time**: The time the backend process started, stored in memory.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: The latest completion timestamp appears in stats within 1 second of session end.
- **SC-002**: After a backend restart, the latest completion timestamp is empty.
- **SC-003**: The timestamp reflects the most recently ended session in manual QA tests.
- **SC-004**: The backend start time appears in system stats within 1 second of server start.

### Assumptions & Dependencies

- Assumes the stats endpoints are the source of truth for session and system metadata.
- Assumes frontend formatting is acceptable using local time display.
