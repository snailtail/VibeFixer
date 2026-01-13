---

description: "Task list for VibeFixer platformer implementation"
---

# Tasks: VibeFixer Platformer

**Input**: Design documents from `/specs/001-build-vibefixer-game/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/openapi.yaml, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create backend and frontend directory structure per plan in `backend/src/` and `frontend/src/`
- [ ] T002 Initialize backend server entry point in `backend/src/server.js` with basic routing and health check
- [ ] T003 [P] Initialize frontend app entry point in `frontend/src/app.js` with game bootstrap hook

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T004 Implement game session store in `backend/src/game/session-store.js` (create/read/update in-memory)
- [ ] T005 Implement level generation module in `backend/src/game/level-generator.js` (terrain + artifacts)
- [ ] T006 [P] Implement scoring rules helper in `backend/src/game/scoring.js`
- [ ] T007 Add API route wiring for session endpoints in `backend/src/api/sessions.js`
- [ ] T008 [P] Add client API wrapper for session endpoints in `frontend/src/game/session-api.js`
- [ ] T009 Define shared input mapping in `frontend/src/game/input.js` for movement/jump/pickup
- [ ] T009a [P] Add asset preloader in `frontend/src/game/assets.js`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Play a timed cleanup round (Priority: P1) 🎯 MVP

**Goal**: Players can start a round, collect artifacts, deposit them, and score before time expires.

**Independent Test**: Start a session, pick up an artifact, deposit it in the trash can, see score increase, and observe game end on timer.

### Implementation for User Story 1

- [ ] T010 [P] [US1] Build game HUD for score and timer in `frontend/src/ui/hud.js`
- [ ] T011 [US1] Implement game loop and timer handling in `frontend/src/game/game-loop.js`
- [ ] T012 [US1] Render player, artifacts, and trash can in `frontend/src/game/renderer.js`
- [ ] T013 [US1] Implement pickup/drop interaction in `frontend/src/game/interactions.js`
- [ ] T014 [US1] Implement POST `/api/sessions` handler in `backend/src/api/sessions.js`
- [ ] T015 [US1] Implement POST `/api/sessions/{id}/deposit` handler in `backend/src/api/sessions.js`
- [ ] T016 [US1] Wire session start and deposit calls in `frontend/src/game/session-api.js`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Navigate obstacles and terrain (Priority: P2)

**Goal**: Players can move, jump, and traverse obstacles to reach artifacts.

**Independent Test**: Move and jump across obstacles, land on platforms, and reach artifacts across the level.

### Implementation for User Story 2

- [ ] T017 [US2] Implement character movement and gravity in `frontend/src/game/physics.js`
- [ ] T018 [US2] Add collision detection with terrain in `frontend/src/game/collision.js`
- [ ] T019 [US2] Render terrain obstacles in `frontend/src/game/renderer.js`
- [ ] T019a [US2] Add side-scrolling camera follow in `frontend/src/game/game-loop.js`

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Start a fresh randomized run (Priority: P3)

**Goal**: Each new game generates different terrain and artifact placement within constraints.

**Independent Test**: Start two new sessions and confirm terrain and artifact positions differ and artifact count is within 30-50.

### Implementation for User Story 3

- [ ] T020 [US3] Implement artifact placement constraints in `backend/src/game/level-generator.js`
- [ ] T021 [US3] Add reachability validation in `backend/src/game/level-validator.js`
- [ ] T022 [US3] Implement POST `/api/sessions/{id}/end` handler in `backend/src/api/sessions.js`
- [ ] T023 [US3] Add new-session reset flow in `frontend/src/game/game-loop.js`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T024 [P] Add empty-state and error messaging in `frontend/src/ui/hud.js`
- [ ] T025 Add drop-on-timeout behavior in `frontend/src/game/interactions.js`
- [ ] T026 [P] Document gameplay controls in `frontend/src/ui/README.md`
- [ ] T027 Run quickstart validation steps in `/Users/magnus/src/Work/VibeFixer/specs/001-build-vibefixer-game/quickstart.md`
- [ ] T028 [P] Add Kenney sprite assets under `frontend/assets/kenney/` and reference in `frontend/src/game/renderer.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational phase
- **User Story 2 (P2)**: Can start after Foundational phase
- **User Story 3 (P3)**: Can start after Foundational phase

### Parallel Opportunities

- Setup tasks T002 and T003 can run in parallel
- Foundational tasks T005, T006, and T008 can run in parallel
- User Story 1 tasks T010 and T014 can run in parallel (different layers)
- User Story 2 tasks T017 and T018 can run in parallel

---

## Parallel Example: User Story 1

```bash
Task: "Build game HUD for score and timer in frontend/src/ui/hud.js"
Task: "Implement POST /api/sessions handler in backend/src/api/sessions.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate User Story 1 independently

### Incremental Delivery

1. Setup + Foundational
2. User Story 1 → validate
3. User Story 2 → validate
4. User Story 3 → validate
5. Polish phase
