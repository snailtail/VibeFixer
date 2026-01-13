# Tasks: FOMO Demon, Cast, and Event Log

**Feature**: FOMO Demon, Cast, and Event Log  
**Branch**: `007-fomo-demon-log`

## Phase 1: Setup

- [ ] T001 Review current game over flow and HUD display in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`

## Phase 2: Foundational

- [ ] T002 Define shared event log and blocker count helpers in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`

## Phase 3: User Story 1 - FOMO Demon end-state (P1)

**Story Goal**: End-game shows defeated or enraged FOMO Demon state with message, sprite, and sound.

**Independent Test Criteria**: End a round with zero blocks and then with remaining blocks to verify correct state, image, and audio.

- [ ] T003 [US1] Add FOMO Demon state evaluation at game over in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`
- [ ] T004 [US1] Render game over state with FOMO Demon sprite in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/renderer.js`
- [ ] T005 [US1] Add angry sound effect hook for enraged state in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/audio.js`

## Phase 4: User Story 2 - Blocker count and placement safety (P2)

**Story Goal**: Track blocker count and ensure blockers are always breakable.

**Independent Test Criteria**: Observe blocker count updates and confirm all blockers can be broken without stacking.

- [ ] T006 [US2] Compute and display blocker count in `/Users/magnus/src/Work/VibeFixer/frontend/src/ui/hud.js`
- [ ] T007 [US2] Ensure blocker placement rules enforce breakable height in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`

## Phase 5: User Story 3 - Event log (P3)

**Story Goal**: Display a left-side log of major events and player actions.

**Independent Test Criteria**: Trigger Imp Ediment, second coder, deposits, and block breaks and verify log entries appear.

- [ ] T008 [US3] Add event log data structure and insert entries on key events in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`
- [ ] T009 [US3] Render event log panel left of the canvas in `/Users/magnus/src/Work/VibeFixer/frontend/index.html`

## Phase 6: User Story 4 - Cast and credits (P4)

**Story Goal**: Show cast bios and credits below the game area.

**Independent Test Criteria**: Scroll below the game area and verify cast list and credits appear.

- [ ] T010 [US4] Add cast list with sprite and bios below the game area in `/Users/magnus/src/Work/VibeFixer/frontend/index.html`
- [ ] T011 [US4] Add credits list including asset sources and co-authors in `/Users/magnus/src/Work/VibeFixer/frontend/index.html`

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T012 Update quickstart smoke tests if needed in `/Users/magnus/src/Work/VibeFixer/specs/007-fomo-demon-log/quickstart.md`

## Dependencies

- User Story 1 → User Story 2 → User Story 3 → User Story 4

## Parallel Execution Examples

- US1 tasks are sequential due to shared rendering and audio.
- US3 log rendering can proceed after log data structure exists.
- US4 UI tasks are independent and can run after core gameplay changes.

## Implementation Strategy

Start with FOMO Demon end-state (US1), then add blocker count safety (US2), then implement the event log (US3), and finish with cast/credits UI (US4).
