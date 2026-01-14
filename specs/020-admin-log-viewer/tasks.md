# Tasks: Admin Log Viewer

**Input**: Design documents from `/specs/020-admin-log-viewer/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Not requested in spec; no test tasks included.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare storage and routing for admin log access

- [ ] T001 Add admin log viewer route placeholder in `backend/src/server.js`
- [ ] T002 [P] Add admin log viewer panel placeholder in `frontend/index.html`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Data and auth plumbing needed by all stories

- [ ] T003 Create log storage/retrieval helper in `backend/src/storage/log-repo.js`
- [ ] T004 [P] Define admin auth config (username/password) in `backend/src/security/policy.js`
- [ ] T005 Implement admin auth check middleware in `backend/src/security/context.js`
- [ ] T006 [P] Wire log events to storage in `backend/src/security/logger.js` (security + gameplay events)

**Checkpoint**: Admin auth and log storage ready

---

## Phase 3: User Story 1 - Review Recent Logs (Priority: P1) 🎯 MVP

**Goal**: Show recent log events in admin viewer

**Independent Test**: Generate sample log events, load admin view, confirm list shows newest first

### Implementation

- [ ] T007 [US1] Implement `GET /api/admin/logs` with auth in `backend/src/api/admin-logs.js`
- [ ] T008 [US1] Query recent logs (last 7 days, default limit) via `backend/src/storage/log-repo.js`
- [ ] T009 [US1] Render recent log list in `frontend/src/app.js` and `frontend/index.html`

**Checkpoint**: Admin can view recent logs

---

## Phase 4: User Story 2 - Triage an Incident (Priority: P2)

**Goal**: Filter by time range, category, severity, and keyword

**Independent Test**: Apply filters and verify only matching events display

### Implementation

- [ ] T010 [US2] Add filter params to `GET /api/admin/logs` in `backend/src/api/admin-logs.js`
- [ ] T011 [US2] Implement filter queries in `backend/src/storage/log-repo.js`
- [ ] T012 [US2] Add filter UI controls in `frontend/index.html`
- [ ] T013 [US2] Wire filter UI to API calls in `frontend/src/app.js`

**Checkpoint**: Filters and search work end-to-end

---

## Phase 5: User Story 3 - Export a Snapshot (Priority: P3)

**Goal**: Export filtered logs

**Independent Test**: Export filtered logs and confirm exported fields

### Implementation

- [ ] T014 [US3] Add export endpoint `GET /api/admin/logs/export` in `backend/src/api/admin-logs.js`
- [ ] T015 [US3] Implement export formatting in `backend/src/storage/log-repo.js`
- [ ] T016 [US3] Add export button and download flow in `frontend/src/app.js`

**Checkpoint**: Export returns filtered snapshot

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T017 [P] Document admin log viewer usage and auth in `README.md`
- [ ] T018 Redaction rules for sensitive values in `backend/src/security/logger.js`

---

## Dependencies & Execution Order

- **Phase 1 → Phase 2**: T001–T002 before foundational changes
- **Phase 2 → US1/US2/US3**: T003–T006 required before story tasks
- **US1/US2/US3**: Can proceed in order; US2 builds on US1, US3 builds on filters
- **Polish**: After story tasks

## Parallel Opportunities

- T002, T004, T006 can run in parallel
- UI tasks (T012, T013, T016) can be parallel if backend endpoints exist

## Parallel Example: User Story 2

```text
- [ ] T010 [US2] Add filter params to GET /api/admin/logs in backend/src/api/admin-logs.js
- [ ] T012 [US2] Add filter UI controls in frontend/index.html
```

## Implementation Strategy

- **MVP**: Complete Phase 1 → Phase 2 → US1, validate log list.
- **Incremental**: Add US2 filters, then US3 export, then polish/redaction.
