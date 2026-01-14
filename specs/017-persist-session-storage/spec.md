# Feature Specification: Persistent Backend Storage

**Feature Branch**: `017-persist-session-storage`  
**Created**: 2026-01-14  
**Status**: Draft  
**Input**: User description: "I would like to be able to persist data like session information over restarts/redeploys of the service - some sort of backend storage on the server instead of the in-memory storage we have now. It should persist even if the docker container is deleted/recreated - so something outside of docker, probably on some volume on the host server. I dont know if a simple file is good enough, or if its best to go for a database of some sort. figure that out please. we might persist more data in the future as well (perhaps high scores)"

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

### User Story 1 - Persist Sessions Across Restarts (Priority: P1)

As a system operator, I want session data to survive backend restarts and redeploys so that active and completed session stats remain accurate.

**Why this priority**: Persistence is the core request and prevents data loss during deploys.

**Independent Test**: Create sessions, restart the backend, and verify session data still exists.

**Acceptance Scenarios**:

1. **Given** sessions exist, **When** the backend restarts, **Then** session data remains available.
2. **Given** the backend is redeployed, **When** stats are requested, **Then** stored session stats reflect pre-restart data.

---

### User Story 2 - Host-Level Persistence (Priority: P2)

As a system operator, I want persisted data stored outside the container so data survives container recreation.

**Why this priority**: Ensures durability across Docker redeploys.

**Independent Test**: Delete the container, recreate it, and verify data persists.

**Acceptance Scenarios**:

1. **Given** data is stored on a host volume, **When** the container is recreated, **Then** the data remains intact.

---

### User Story 3 - Future Data Ready (Priority: P3)

As a developer, I want storage that can grow to include future data (e.g., high scores) without a major redesign.

**Why this priority**: Reduces rework when new persistence needs arise.

**Independent Test**: Validate that the storage structure can accept a new data type without breaking existing data.

**Acceptance Scenarios**:

1. **Given** a new data type is added, **When** it is stored, **Then** existing session data remains intact.

---

[Add more user stories as needed, each with an assigned priority]

## Clarifications

### Session 2026-01-14

- Q: Preferred persistence type for host storage? → A: SQLite database file on a host-mounted volume.

### Edge Cases

- Data store should handle startup when no persisted data exists.
- Corrupt or partial data should not crash the backend; use a safe fallback.
- Large number of sessions should not cause excessive startup delay.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: The backend MUST persist session and stats data to durable storage on the host.
- **FR-002**: The persisted data MUST survive container recreation and backend restarts.
- **FR-003**: The storage solution MUST support additional data types in the future.
- **FR-004**: The backend MUST load persisted data on startup.
- **FR-005**: The backend MUST handle missing or corrupt storage data gracefully.
- **FR-006**: The deployment MUST mount the storage location from the host into the container.
- **FR-007**: The persisted store MUST be a SQLite database file stored on the host-mounted volume.

### Key Entities *(include if feature involves data)*

- **Session Data Store**: Durable storage containing session records and stats.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Session stats remain intact after a backend restart in manual tests.
- **SC-002**: Session stats remain intact after container recreation in manual tests.
- **SC-003**: Backend starts successfully even when no data file exists.
- **SC-004**: Backend recovers with a clear fallback when data is corrupt.

### Assumptions & Dependencies

- Assumes a writable host-mounted volume is available.
- Assumes a SQLite file-based store is sufficient until higher scale is required.
- Assumes system stats remain runtime-only and are not persisted.
