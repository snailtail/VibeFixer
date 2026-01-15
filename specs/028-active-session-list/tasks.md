# Tasks: Active Session List

**Input**: Design documents from `/specs/028-active-session-list/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/active-sessions.yaml, quickstart.md

**Tests**: Not requested for this feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Add shared active-session list styling in `frontend/admin.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T002 Add active session summary helper in `backend/src/game/session-store.js`
- [X] T003 [P] Add admin active sessions API handler in `backend/src/api/admin-active-sessions.js`
- [X] T004 Wire admin active sessions API handler in `backend/src/server.js`
- [X] T005 Add admin page route for `/admin/active-sessions` in `backend/src/server.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Active Sessions (Priority: P1) 🎯 MVP

**Goal**: Admins can open an active session list page and see key details or an empty state.

**Independent Test**: Start multiple sessions, load the admin active session list page, and verify each active session appears with required details or an empty-state message when none exist.

### Implementation for User Story 1

- [X] T006 [P] [US1] Create admin page layout in `frontend/admin-active-sessions.html`
- [X] T007 [P] [US1] Add active sessions fetch/render module with `ensureSession` and empty-state handling in `frontend/src/admin/active-sessions.js`
- [X] T008 [US1] Add active sessions nav link in `frontend/admin.html`
- [X] T009 [P] [US1] Add active sessions nav link in `frontend/admin-logs.html`
- [X] T010 [P] [US1] Add active sessions nav link in `frontend/admin-high-scores.html`
- [X] T011 [P] [US1] Add active sessions nav link in `frontend/admin-notices.html`
- [X] T012 [P] [US1] Add active sessions nav link in `frontend/admin-game-settings.html`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Keep the List Current (Priority: P2)

**Goal**: The active session list stays current within 4 seconds while viewing the page.

**Independent Test**: Start and end sessions while the page is open and confirm the list refreshes to match actual active sessions within 4 seconds.

### Implementation for User Story 2

- [X] T013 [US2] Add refresh interval and update handling in `frontend/src/admin/active-sessions.js`

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T014 [P] Validate quickstart steps in `specs/028-active-session-list/quickstart.md`
- [X] T015 [P] Update documentation references if needed in `docs/DEVELOPMENT.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Phase 5)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Requires Foundational phase completion
- **User Story 2 (P2)**: Requires User Story 1 (active session list page exists)

### Parallel Opportunities

- T003 can run in parallel with T002
- T006 and T007 can run in parallel
- T009 through T012 can run in parallel
- T014 and T015 can run in parallel

---

## Parallel Example: User Story 1

```bash
Task: "Create admin page layout in frontend/admin-active-sessions.html"
Task: "Add active sessions fetch/render module in frontend/src/admin/active-sessions.js"
```

---

## Parallel Example: User Story 2

```bash
Task: "Add refresh interval and update handling in frontend/src/admin/active-sessions.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate User Story 1 independently

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. User Story 1 → Test independently → Demo MVP
3. User Story 2 → Test independently → Demo updates
