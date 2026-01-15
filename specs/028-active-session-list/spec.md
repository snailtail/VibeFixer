# Feature Specification: Active Session List

**Feature Branch**: `028-active-session-list`  
**Created**: 2026-01-15  
**Status**: Draft  
**Input**: User description: "active session list"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Active Sessions (Priority: P1)

As an admin, I want to see a list of currently active game sessions so I can understand live activity at a glance.

**Why this priority**: Live session visibility is the primary outcome of an active session list.

**Independent Test**: Start multiple sessions, load the admin view, and verify each active session appears with required details.

**Acceptance Scenarios**:

1. **Given** one or more sessions are active, **When** I view the active session list, **Then** each active session is shown with its key details (identifier, status, start time, elapsed duration, current score, remaining artifacts, and player speed modifier).
2. **Given** no sessions are active, **When** I view the active session list, **Then** a clear empty-state message is displayed.

---

### User Story 2 - Keep the List Current (Priority: P2)

As an admin, I want the active session list to stay current so I can trust the view during live monitoring.

**Why this priority**: A stale list undermines operational decision-making.

**Independent Test**: Start and end sessions while viewing the list and confirm the list updates to match actual active sessions.

**Acceptance Scenarios**:

1. **Given** a session starts while I am viewing the list, **When** the list refreshes, **Then** the new session appears.
2. **Given** a session ends while I am viewing the list, **When** the list refreshes, **Then** the session is no longer shown.

### Edge Cases

- What happens when a session ends between list refreshes?
- How does the system handle a very large number of active sessions?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an admin-only view that lists all currently active sessions.
- **FR-002**: Each active session in the list MUST display a unique identifier, status, start time, and elapsed duration.
- **FR-003**: Each active session in the list MUST display current score and remaining artifacts.
- **FR-004**: Each active session in the list MUST display the current player speed modifier.
- **FR-005**: The list MUST update to reflect session starts and ends within 4 seconds.
- **FR-006**: When no sessions are active, the view MUST show a clear empty-state message.

### Key Entities *(include if feature involves data)*

- **Active Session Summary**: Represents a live session with identifier, status, start time, elapsed duration, current score, remaining artifacts, and player speed modifier.

### Assumptions

- The active session list is read-only and does not allow admins to modify or terminate sessions.
- Only authenticated admins can access the active session list.

### Dependencies

- Access to real-time session tracking for active sessions.
- Admin authentication and routing already exist.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The active session list loads and displays results within 2 seconds for 95% of admin page loads.
- **SC-002**: In QA testing, the active session list matches the actual number of live sessions in 100% of test runs.
- **SC-003**: Admins can identify the start time and current progress of a specific active session within 15 seconds.
- **SC-004**: Active session list updates reflect session starts/ends within 4 seconds during QA validation.
