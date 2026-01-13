# Tasks: Randomized Coder Drops

**Feature**: Randomized Coder Drops  
**Branch**: `005-randomize-coder-drops`

## Phase 1: Setup

- [ ] T001 Review current coder spawn/drop logic in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`

## Phase 2: Foundational

- [ ] T002 Define shared play-area bounds constants for coder spawns and drops in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`

## Phase 3: User Story 1 - Unpredictable coder spawns (P1)

**Story Goal**: Coders start at different X positions each round without leaving the play area.

**Independent Test Criteria**: Start multiple rounds and confirm coder spawn X differs across runs and stays within bounds.

- [ ] T003 [US1] Randomize the first coder spawn X within bounds in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`
- [ ] T004 [US1] Randomize the first coder initial direction in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`
- [ ] T005 [US1] Randomize the second coder spawn time and spawn X without overlapping the first coder in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`

## Phase 4: User Story 2 - Variable coder speed (P2)

**Story Goal**: Coders change speed during the round to create less predictable drop locations.

**Independent Test Criteria**: Observe a coder and confirm its speed changes at least once in a round.

- [ ] T006 [US2] Add periodic random speed updates per coder in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`
- [ ] T007 [US2] Keep speed changes within bounds and preserve play-area constraints in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`

## Phase 5: User Story 3 - Drops follow coder position (P3)

**Story Goal**: Drops occur directly at the coder’s current position.

**Independent Test Criteria**: Observe drops and confirm they align with coder position.

- [ ] T008 [US3] Spawn artifacts at coder X position in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`
- [ ] T009 [US3] Clamp drop X to playable bounds while preserving coder alignment in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T010 Update quickstart smoke tests if needed in `/Users/magnus/src/Work/VibeFixer/specs/005-randomize-coder-drops/quickstart.md`

## Dependencies

- User Story 1 → User Story 2 → User Story 3

## Parallel Execution Examples

- US1 tasks (T003, T004) can run in parallel after T002 if handled by different files (but they are in the same file, so keep sequential).
- US2 tasks (T005, T006) are sequential in the same file.
- US3 tasks (T007, T008) are sequential in the same file.

## Implementation Strategy

Start with coder spawn randomization (US1) to validate bounds handling, then add drop timing (US2), and finally add drop position randomization (US3). Finish with quickstart updates.
