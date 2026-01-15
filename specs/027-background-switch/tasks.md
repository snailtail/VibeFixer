---

description: "Task list for Background Switcher"
---

# Tasks: Background Switcher

**Input**: Design documents from `/specs/027-background-switch/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested for this feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Confirm asset availability for kommun/danger backgrounds in frontend assets (e.g., frontend/src/assets/)
- [X] T002 Identify existing background rendering path in frontend game renderer (frontend/src/game/renderer.js)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Add background preference load/save helper in frontend input/session layer (frontend/src/game/session-api.js)
- [X] T004 [P] Define background state shape and default selection in game state (frontend/src/game/game-loop.js)
- [X] T005 Add background indicator surface in HUD (frontend/src/ui/hud.js)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Choose a background before playing (Priority: P1) 🎯 MVP

**Goal**: Allow players to select kommun or danger background before gameplay and see which is active without on-screen selector UI.

**Independent Test**: Load the game, toggle background before starting, verify the background changes and indicator reflects the active background with no on-screen selector.

### Implementation for User Story 1

- [X] T006 [US1] Implement background toggle input handling for B key before game start (frontend/src/game/input.js)
- [X] T007 [US1] Wire background selection into renderer background draw path (frontend/src/game/renderer.js)
- [X] T008 [US1] Add fallback when background asset is missing and surface indicator (frontend/src/game/renderer.js)
- [X] T009 [US1] Show active background indicator in HUD (frontend/src/ui/hud.js)
- [X] T010 [US1] Persist selected background locally on selection (frontend/src/game/session-api.js)
- [X] T011 [US1] Ensure no on-screen background selector is rendered (frontend/index.html)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Switch backgrounds during play (Priority: P2)

**Goal**: Allow players to switch backgrounds mid-session without interrupting gameplay.

**Independent Test**: Start a session, press B, confirm background toggles immediately while gameplay continues.

### Implementation for User Story 2

- [X] T012 [US2] Enable background toggle input during active gameplay (frontend/src/game/input.js)
- [X] T013 [US2] Keep renderer state consistent across live background swaps (frontend/src/game/renderer.js)
- [X] T014 [US2] Verify background toggle does not pause or alter session timing (frontend/src/game/game-loop.js)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Keep my preferred background (Priority: P3)

**Goal**: Remember the player’s last background choice on the same device and apply it on load.

**Independent Test**: Select a background, reload, and confirm the same background is preselected and shown.

### Implementation for User Story 3

- [X] T015 [US3] Load saved background preference on game initialization (frontend/src/game/session-api.js)
- [X] T016 [US3] Handle invalid stored background by defaulting to kommun (frontend/src/game/session-api.js)
- [X] T017 [US3] Apply saved preference to initial renderer state (frontend/src/game/game-loop.js)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T018 Update documentation for background switching behavior (docs/DEVELOPMENT.md)
- [ ] T019 [P] Validate quickstart steps manually (specs/027-background-switch/quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1/US2 but should be independently testable

### Within Each User Story

- Models before services (if applicable)
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T004 can run in parallel with T003/T005
- T012 and T013 can run in parallel if coordinated on shared files
- T019 can run in parallel after stories are complete

---

## Parallel Example: User Story 1

```bash
Task: "Implement background toggle input handling for B key before game start (frontend/src/game/input.js)"
Task: "Wire background selection into renderer background draw path (frontend/src/game/renderer.js)"
Task: "Show active background indicator in HUD (frontend/src/ui/hud.js)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
