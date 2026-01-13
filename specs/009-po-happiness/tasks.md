# Tasks: PO Happiness Status

**Feature**: PO Happiness Status
**Spec**: /Users/magnus/src/Work/VibeFixer/specs/009-po-happiness/spec.md
**Plan**: /Users/magnus/src/Work/VibeFixer/specs/009-po-happiness/plan.md

## Phase 1: Setup

- [ ] T001 Add PO mood image assets to `frontend/src/assets/po_happy.png`, `frontend/src/assets/po_content.png`, `frontend/src/assets/po_sad.png`

## Phase 2: Foundational

- [ ] T002 Add PO mood mapping helper based on blocker count in `frontend/src/game/game-loop.js`

## Phase 3: User Story 1 (P1) - PO mood reflects blockers

**Story Goal**: Derive PO mood from blocker count in the game state.

**Independent Test Criteria**: Changing blocker count updates the derived PO mood correctly.

- [ ] T003 [US1] Update game state to compute PO mood on blocker count changes in `frontend/src/game/game-loop.js`

## Phase 4: User Story 2 (P2) - PO image display

**Story Goal**: Show PO mood image in the PO STATUS panel.

**Independent Test Criteria**: PO image updates when blocker count changes.

- [ ] T004 [US2] Add PO mood image element to `frontend/index.html`
- [ ] T005 [US2] Update frontend rendering to swap PO images based on mood in `frontend/src/app.js`
- [ ] T006 [US2] Add CSS to scale PO image to panel bounds in `frontend/index.html`

## Phase 5: User Story 3 (P3) - Consistent layout

**Story Goal**: Keep PO STATUS panel anchored below the event log.

**Independent Test Criteria**: Layout remains stable while mood changes.

- [ ] T007 [US3] Verify PO STATUS panel sizing remains stable in `frontend/index.html`

## Phase 6: Polish & Cross-Cutting

- [ ] T008 Add PO mood notes to `specs/009-po-happiness/quickstart.md`

## Dependencies

- US1 depends on Foundational task T002.
- US2 depends on US1 (mood computed before display).
- US3 depends on layout changes in US2.

## Parallel Execution Examples

- T004 and T006 can be done in parallel after T002.
- T005 can run after T004.

## Implementation Strategy

Start with mood mapping (T002-T003), then add the PO image panel and styling (T004-T006), verify layout stability (T007), and update quickstart notes (T008).
