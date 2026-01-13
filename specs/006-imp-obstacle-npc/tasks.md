# Tasks: Imp Ediment Obstacles

**Feature**: Imp Ediment Obstacles  
**Branch**: `006-imp-obstacle-npc`

## Phase 1: Setup

- [ ] T001 Review current obstacle placement and collision rules in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`

## Phase 2: Foundational

- [ ] T002 Define placement bounds and collision helpers for new obstacles in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`

## Phase 3: User Story 1 - Imp appearance and obstacle placement (P1)

**Story Goal**: Imp Ediment appears between 10–20 seconds and places 1–5 obstacles within 2 seconds.

**Independent Test Criteria**: Run a round past 10 seconds and confirm the imp appears and places 1–5 valid obstacles within 2 seconds.

- [ ] T003 [US1] Add Imp Ediment appearance scheduling and placement loop in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`
- [ ] T004 [US1] Enforce placement rules (min height, no overlaps) in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`
- [ ] T005 [US1] Render Imp Ediment teleport sprite at placement locations in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/renderer.js`

## Phase 4: User Story 2 - Optional second appearance (P2)

**Story Goal**: The imp may appear again after 40 seconds with a toast and same placement rules.

**Independent Test Criteria**: Run multiple rounds and confirm the second appearance sometimes happens after 40 seconds with the toast message.

- [ ] T006 [US2] Add optional second appearance scheduling and toast trigger in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/game-loop.js`

## Phase 5: User Story 3 - Teleporting NPC feedback (P3)

**Story Goal**: The imp plays a whoosh sound and shows its sprite each time it appears.

**Independent Test Criteria**: Observe appearances and confirm the sound plays with the sprite visible at teleport points.

- [ ] T007 [US3] Add whooshing sound playback on each appearance in `/Users/magnus/src/Work/VibeFixer/frontend/src/game/audio.js`

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T008 Update quickstart smoke tests if needed in `/Users/magnus/src/Work/VibeFixer/specs/006-imp-obstacle-npc/quickstart.md`

## Dependencies

- User Story 1 → User Story 2 → User Story 3

## Parallel Execution Examples

- US1 tasks are mostly sequential due to shared logic in the game loop.
- US3 audio work can be done after appearance events are wired.

## Implementation Strategy

Start with the core appearance schedule and placement rules (US1), add the optional second appearance with toast (US2), then wire audio feedback (US3). Finish with quickstart updates.
