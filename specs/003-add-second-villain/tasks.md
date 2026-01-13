---

description: "Task list for adding a second vibe coder and toast"
---

# Tasks: Second Vibe Coder + Toast

**Input**: Design documents from `/specs/003-add-second-villain/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Confirm current game state on `003-add-second-villain` branch and locate baseline coder logic in `frontend/src/game/game-loop.js`
- [ ] T002 [P] Identify existing toast rendering logic in `frontend/src/game/renderer.js` for reuse

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T003 Define coder timing constants in `frontend/src/game/game-loop.js` (spawn time, toast lead time)
- [ ] T004 Define a lightweight toast state object in `frontend/src/game/game-loop.js`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Handle the second vibe coder (Priority: P1) 🎯 MVP

**Goal**: A second vibe coder appears at 30 seconds and doubles drop rate.

**Independent Test**: Run a round past 30 seconds and verify two coders drop artifacts concurrently.

### Implementation for User Story 1

- [ ] T005 [US1] Add a second coder instance to game state in `frontend/src/game/game-loop.js`
- [ ] T006 [US1] Spawn the second coder at 30 seconds elapsed with opposite direction in `frontend/src/game/game-loop.js`
- [ ] T007 [US1] Ensure coder 2 uses the same base speed and drop cadence in `frontend/src/game/game-loop.js`
- [ ] T008 [US1] Update artifact drop loop to handle multiple coders in `frontend/src/game/game-loop.js`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - See a mid‑round toast (Priority: P2)

**Goal**: A non‑blocking toast warns the player shortly before the second coder appears.

**Independent Test**: Observe the toast appear a few seconds before 30 seconds without interrupting gameplay.

### Implementation for User Story 2

- [ ] T009 [US2] Add toast timing trigger in `frontend/src/game/game-loop.js`
- [ ] T010 [US2] Render the toast overlay in `frontend/src/game/renderer.js` without pausing gameplay
- [ ] T011 [US2] Use the specified message in `frontend/src/game/renderer.js`

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Keep base coder speed unchanged (Priority: P3)

**Goal**: Original coder speed remains constant throughout the round.

**Independent Test**: Compare coder movement before and after 30 seconds and confirm it is unchanged.

### Implementation for User Story 3

- [ ] T012 [US3] Remove any time-based speed scaling from coder logic in `frontend/src/game/game-loop.js`
- [ ] T013 [US3] Keep drop cadence constant for each coder across the round in `frontend/src/game/game-loop.js`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T014 [P] Ensure toast does not block inputs in `frontend/src/game/input.js`
- [ ] T015 Run quickstart validation steps in `/Users/magnus/src/Work/VibeFixer/specs/003-add-second-villain/quickstart.md`

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

- Setup tasks T001 and T002 can run in parallel
- User Story 1 tasks T005 and T006 can run in parallel (data vs timing)
- User Story 2 tasks T009 and T010 can run in parallel (trigger vs render)

---

## Parallel Example: User Story 1

```bash
Task: "Add a second coder instance to game state in frontend/src/game/game-loop.js"
Task: "Spawn the second coder at 30 seconds elapsed in frontend/src/game/game-loop.js"
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
