# Tasks: Persistent Backend Storage

**Input**: Design documents from `/specs/017-persist-session-storage/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add baseline storage dependencies and structure

- [ ] T001 Initialize backend Node package with better-sqlite3 dependency in `backend/package.json`
- [ ] T002 [P] Add storage config for DB path in `backend/src/storage/config.js`
- [ ] T003 [P] Create SQLite connection wrapper in `backend/src/storage/sqlite.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core persistence layer required for all stories

- [ ] T004 Implement SQLite schema setup for sessions, artifacts, and stats in `backend/src/storage/sqlite.js`
- [ ] T005 [P] Add serialization helpers for terrain/artifacts in `backend/src/storage/serializers.js`
- [ ] T006 Implement session repository (create/load/update/end/stats) in `backend/src/storage/session-repo.js`
- [ ] T007 Wire storage initialization into startup in `backend/src/server.js`
- [ ] T008 Update session store to use repository and load persisted data on boot in `backend/src/game/session-store.js`
- [ ] T009 Implement corrupt/missing DB fallback (recreate DB, log warning) in `backend/src/storage/sqlite.js`

---

## Phase 3: User Story 1 - Persist Sessions Across Restarts (Priority: P1) 🎯 MVP

**Goal**: Session data and stats survive backend restarts

**Independent Test**: Create sessions, restart backend, verify `/api/sessions/stats` reflects previous state

- [ ] T010 [US1] Persist session lifecycle updates (start/end/results) through repository in `backend/src/game/session-store.js`
- [ ] T011 [US1] Persist stats updates (latest completion, counts) in `backend/src/storage/session-repo.js`
- [ ] T012 [US1] Update quickstart verification steps in `specs/017-persist-session-storage/quickstart.md`

---

## Phase 4: User Story 2 - Host-Level Persistence (Priority: P2)

**Goal**: Data survives container recreation via host-mounted volume

**Independent Test**: Recreate container and verify stats persist

- [ ] T013 [US2] Mount host volume and set DB path env var in `docker-compose.yml`
- [ ] T014 [US2] Ensure host data directory exists and permissions are correct in `docs/DEVELOPMENT.md`

---

## Phase 5: User Story 3 - Future Data Ready (Priority: P3)

**Goal**: Storage can accept new data types without major redesign

**Independent Test**: Add a placeholder table and ensure no regression in existing data

- [ ] T015 [US3] Add schema version/migration table in `backend/src/storage/sqlite.js`
- [ ] T016 [US3] Document storage extension guidelines in `backend/src/storage/README.md`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T017 [P] Update persistence notes in `README.md`
- [ ] T018 Run quickstart validation from `specs/017-persist-session-storage/quickstart.md`

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → US1 → US2 → US3 → Polish
- US1 depends on Phase 2 completion
- US2 depends on Phase 2 completion
- US3 depends on Phase 2 completion

## Parallel Opportunities

- T002 and T003 can run in parallel
- T004 and T005 can run in parallel
- T013 and T014 can run in parallel
- T017 can run alongside US2/US3 documentation tasks

## MVP Scope

Focus on Phase 1 + Phase 2 + User Story 1 to deliver persistence across restarts.
