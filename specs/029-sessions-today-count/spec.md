# Feature Specification: Sessions Today Count

**Feature Branch**: `029-sessions-today-count`  
**Created**: 2026-01-15  
**Status**: Draft  
**Input**: User description: "Sessions Today: I want a count of Sessions today in the System Stats pane on the /admin page."

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

### User Story 1 - View sessions today count (Priority: P1)

As an admin, I want to see the number of sessions that started today in the System Stats pane on the /admin page so I can gauge current-day activity at a glance.

**Why this priority**: This is the core request and provides immediate operational visibility.

**Independent Test**: Can be fully tested by visiting /admin and confirming the count matches known session activity for today.

**Acceptance Scenarios**:

1. **Given** there are sessions that started today, **When** an admin views the System Stats pane, **Then** the "Sessions Today" value equals the count of sessions that started today.
2. **Given** there are no sessions that started today, **When** an admin views the System Stats pane, **Then** the "Sessions Today" value displays as 0.

---

### User Story 2 - Trust the displayed count (Priority: P2)

As an admin, I want the "Sessions Today" count to reflect the same definition of "today" used by the system so I can compare it with other daily stats.

**Why this priority**: Consistency avoids confusion and supports reliable reporting.

**Independent Test**: Can be fully tested by verifying the count for a known day boundary and confirming it matches system time definition.

**Acceptance Scenarios**:

1. **Given** the system has a defined "today" boundary, **When** an admin views the System Stats pane, **Then** the "Sessions Today" count reflects sessions that started within that boundary.

### Edge Cases

- What happens when a session starts exactly at the day boundary (start of "today")?
- What happens when a session starts just before the day boundary and continues into today?
- How does the count behave if no sessions exist in the system?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST display a "Sessions Today" value in the System Stats pane on the /admin page.
- **FR-002**: System MUST count sessions that started within the system-defined "today" time window.
- **FR-003**: System MUST include sessions that start exactly at the beginning of "today" and exclude sessions that start before that boundary.
- **FR-004**: System MUST present the count as a whole number.

### Key Entities *(include if feature involves data)*

- **Session**: A user interaction period with a recorded start time used to determine whether it occurred today.
- **System Stats Pane**: The admin-facing summary area on the /admin page that displays system metrics.

## Assumptions

- "Today" uses the system's standard day boundary and timezone already used for other daily statistics.
- Only admins with access to /admin can view the System Stats pane.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Admins can see a "Sessions Today" value on the /admin page without additional steps.
- **SC-002**: For a day with known session starts, the displayed count matches the expected total 100% of the time.
- **SC-003**: The "Sessions Today" value is available whenever the System Stats pane is visible to an admin.
