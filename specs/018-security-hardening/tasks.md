# Tasks: Security Hardening (OWASP 2025)

**Input**: Design documents from `/specs/018-security-hardening/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested for this feature.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Shared security scaffolding used by all stories.

- [ ] T001 Create security policy defaults in `backend/src/security/policy.js`
- [ ] T002 [P] Add structured security logger helper in `backend/src/security/logger.js`
- [ ] T003 [P] Add request validation helpers in `backend/src/security/validate.js`
- [ ] T004 [P] Add in-memory rate limiter helper in `backend/src/security/rate-limit.js`
- [ ] T005 Add safe error response helper in `backend/src/security/errors.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Wiring shared security helpers into request handling flow.

- [ ] T006 Wire security helpers into request lifecycle in `backend/src/server.js`
- [ ] T007 Add centralized request context extraction (IP, path, method) in `backend/src/security/context.js`

---

## Phase 3: User Story 1 - Harden Public APIs (Priority: P1) 🎯 MVP

**Goal**: Rate-limit and validate all public write endpoints.

**Independent Test**: Send >60 POSTs/min to a write endpoint and invalid JSON bodies; confirm 429/400 with no crashes.

### Implementation

- [ ] T008 [US1] Apply rate limiting to write endpoints in `backend/src/server.js`
- [ ] T009 [US1] Add validation rules for sessions endpoints in `backend/src/api/sessions.js`
- [ ] T010 [US1] Add validation rules for high scores in `backend/src/api/high-scores.js`
- [ ] T011 [US1] Return safe JSON errors on validation failures in `backend/src/api/sessions.js`
- [ ] T012 [US1] Return safe JSON errors on validation failures in `backend/src/api/high-scores.js`

---

## Phase 4: User Story 2 - Secure Defaults & Headers (Priority: P2)

**Goal**: Enforce baseline security headers on all responses.

**Independent Test**: Inspect response headers for CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.

### Implementation

- [ ] T013 [US2] Add security headers to all responses in `backend/src/server.js`
- [ ] T014 [US2] Ensure static file responses include security headers in `backend/src/server.js`

---

## Phase 5: User Story 3 - Observability & Safe Failures (Priority: P3)

**Goal**: Add structured logging and safe error handling across APIs.

**Independent Test**: Trigger rate limits and server errors; confirm structured logs and safe responses.

### Implementation

- [ ] T015 [US3] Emit structured logs for rate-limit events in `backend/src/security/logger.js`
- [ ] T016 [US3] Emit structured logs for validation failures in `backend/src/security/logger.js`
- [ ] T017 [US3] Add global try/catch around request handling in `backend/src/server.js`
- [ ] T018 [US3] Add retention cleanup for sessions in `backend/src/game/session-store.js`
- [ ] T019 [US3] Add retention cleanup for high scores in `backend/src/storage/high-score-repo.js`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and supply-chain integrity controls.

- [ ] T020 [P] Generate backend lockfile with `npm install` in `backend/` and commit `backend/package-lock.json`
- [ ] T021 [P] Add CI `npm audit` workflow in `.github/workflows/security-audit.yml`
- [ ] T022 Document dependency update cadence in `docs/DEVELOPMENT.md`
- [ ] T023 Document data retention rules and schema versioning approach in `README.md`
- [ ] T024 Document TLS enforcement verification steps in `README.md`
- [ ] T025 Verify quickstart commands in `specs/018-security-hardening/quickstart.md`

---

## Dependencies & Execution Order

- **Phase 1** must complete before Phase 2.
- **Phase 2** blocks all user story work.
- **US1 (P1)** can begin after Phase 2 and delivers the MVP security protections.
- **US2 (P2)** and **US3 (P3)** can proceed after Phase 2, parallel to each other.
- **Polish** follows after desired user stories are complete.

## Parallel Opportunities

- T002–T004 can be done in parallel.
- T020–T022 can be done in parallel.
- US2 and US3 can be implemented in parallel after Phase 2.
