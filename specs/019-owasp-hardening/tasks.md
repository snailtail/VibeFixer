# Tasks: OWASP Hardening (Remaining Items)

**Input**: Design documents from `/specs/019-owasp-hardening/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested in spec; no test tasks included.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align on entry points and shared security utilities

- [ ] T001 Review current error handling/logging entry points in `backend/src/server.js` and `backend/src/security/*.js` to confirm integration points

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared utilities used by all security hardening tasks

- [ ] T002 Create alert threshold tracker in `backend/src/security/alerts.js` (per-minute counts, threshold 10)
- [ ] T003 [P] Add alert emission helper in `backend/src/security/logger.js` to log structured alert events
- [ ] T004 [P] Define expected schema version constant in `backend/src/storage/config.js`

**Checkpoint**: Foundational utilities ready

---

## Phase 3: User Story 1 - Stable Production Security (Priority: P1) 🎯 MVP

**Goal**: Safe production errors, clear startup environment logging, resilient DB failures

**Independent Test**: Run backend with `NODE_ENV=production`, trigger a DB error and confirm safe response + logs

### Implementation

- [ ] T005 [US1] Log runtime environment and config warnings in `backend/src/server.js`
- [ ] T006 [US1] Ensure production errors are generic in `backend/src/security/errors.js`
- [ ] T007 [US1] Wrap DB access errors and return safe responses in `backend/src/api/sessions.js`
- [ ] T008 [US1] Wrap DB access errors and return safe responses in `backend/src/api/high-scores.js`

**Checkpoint**: Production safety controls verified

---

## Phase 4: User Story 2 - Integrity & Data Safety (Priority: P2)

**Goal**: Schema version enforcement and integrity logging

**Independent Test**: Start backend with a mismatched schema version and confirm safe failure with log

### Implementation

- [ ] T009 [US2] Validate schema version on startup in `backend/src/storage/sqlite.js` (fail safe on mismatch)
- [ ] T010 [US2] Log successful storage integrity checks in `backend/src/storage/sqlite.js`
- [ ] T011 [US2] Record schema version status in `backend/src/storage/sqlite.js` init flow

**Checkpoint**: Storage integrity gate in place

---

## Phase 5: User Story 3 - Maintenance Guardrails (Priority: P3)

**Goal**: Audit cadence, lockfile integrity checks, and alerting hooks

**Independent Test**: Run workflow locally/CI and trigger alert threshold to confirm logs

### Implementation

- [ ] T012 [US3] Wire alert tracker into validation failures in `backend/src/security/validate.js`
- [ ] T013 [US3] Wire alert tracker into DB error handling in `backend/src/security/errors.js`
- [ ] T014 [US3] Add lockfile integrity check step in `.github/workflows/security-audit.yml`
- [ ] T015 [US3] Document audit cadence and no-admin-endpoints scope in `README.md`

**Checkpoint**: Maintenance guardrails and documentation updated

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T016 [P] Update `OWASP_TODO.md` to mark newly completed items
- [x] T017 Run quickstart validation steps from `specs/019-owasp-hardening/quickstart.md`

---

## Dependencies & Execution Order

- **Phase 1 → Phase 2**: T001 before foundational updates
- **Phase 2 → US1/US2/US3**: T002–T004 required before story tasks
- **US1/US2/US3**: Can run in parallel after Phase 2
- **Polish**: After all story tasks complete

## Parallel Opportunities

- T003 and T004 can run in parallel
- US1/US2/US3 tasks can be split across different files and run in parallel by different contributors
- T016 can be done in parallel once stories are complete

## Parallel Example: User Story 3

```text
- [ ] T012 [US3] Wire alert tracker into validation failures in backend/src/security/validate.js
- [ ] T013 [US3] Wire alert tracker into DB error handling in backend/src/security/errors.js
- [ ] T014 [US3] Add lockfile integrity check step in .github/workflows/security-audit.yml
```

## Implementation Strategy

- **MVP**: Complete Phase 1 → Phase 2 → US1 only, validate production safety.
- **Incremental**: Add US2 (integrity checks), then US3 (guardrails), then Polish.
