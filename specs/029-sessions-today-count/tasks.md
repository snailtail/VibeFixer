---

description: "Task list for Sessions Today Count"
---

# Tasks: Sessions Today Count

**Input**: Design documents from `/specs/029-sessions-today-count/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline review

- [x] T001 Review existing System Stats UI and API structure in /data/src/VibeFixer/frontend/admin.html and /data/src/VibeFixer/backend/src/api/system.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core building blocks required by all user stories

- [x] T002 Add a shared start-of-today boundary helper in /data/src/VibeFixer/backend/src/game/day-boundary.js

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View sessions today count (Priority: P1) 🎯 MVP

**Goal**: Display a Sessions Today count in the System Stats pane on /admin

**Independent Test**: Open /admin and confirm the Sessions Today value matches known sessions started today

### Implementation for User Story 1

- [x] T003 [P] [US1] Add a session count query for a start/end window in /data/src/VibeFixer/backend/src/storage/session-repo.js
- [x] T004 [US1] Compute the today window and fetch sessionsToday in /data/src/VibeFixer/backend/src/game/session-store.js
- [x] T005 [US1] Include sessionsToday in /data/src/VibeFixer/backend/src/api/system.js response payload
- [x] T006 [P] [US1] Add a "Sessions Today" row and element id in /data/src/VibeFixer/frontend/admin.html
- [x] T007 [US1] Render sessionsToday in /data/src/VibeFixer/frontend/src/admin/overview.js

**Checkpoint**: User Story 1 is fully functional and independently testable

---

## Phase 4: User Story 2 - Trust the displayed count (Priority: P2)

**Goal**: Ensure the Sessions Today count uses the system-defined day boundary consistently

**Independent Test**: Verify a session started exactly at the day boundary is counted and one just before is not

### Implementation for User Story 2

- [x] T008 [US2] Align day-boundary helper behavior with system timezone definition in /data/src/VibeFixer/backend/src/game/day-boundary.js
- [x] T009 [US2] Enforce inclusive/exclusive boundary rules in /data/src/VibeFixer/backend/src/storage/session-repo.js

**Checkpoint**: User Story 2 logic matches the system-defined boundary rules

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validation and documentation alignment

- [x] T010 [P] Verify the API contract reflects sessionsToday in /data/src/VibeFixer/specs/029-sessions-today-count/contracts/system-stats.openapi.yaml
- [x] T011 [P] Validate quickstart steps against current behavior in /data/src/VibeFixer/specs/029-sessions-today-count/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion; uses the Sessions Today count from User Story 1 for validation
- **Polish (Phase 5)**: Depends on completion of user stories

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies beyond Foundational
- **User Story 2 (P2)**: Relies on User Story 1 for visible output to validate boundary behavior

### Parallel Opportunities

- **US1**: T003 and T006 can run in parallel (backend query vs UI markup)
- **Polish**: T010 and T011 can run in parallel

---

## Parallel Example: User Story 1

```bash
Task: "Add a session count query for a start/end window in /data/src/VibeFixer/backend/src/storage/session-repo.js"
Task: "Add a \"Sessions Today\" row and element id in /data/src/VibeFixer/frontend/admin.html"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate User Story 1 independently on /admin

### Incremental Delivery

1. Complete Setup + Foundational
2. Deliver User Story 1 (MVP) and validate
3. Deliver User Story 2 boundary consistency adjustments and re-validate
4. Perform Polish tasks
