# Tasks: Instructions pane and toast visibility

**Input**: Design documents from `/specs/025-instructions-pane-and/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)

## Phase 3: User Story 1 - Read gameplay instructions (Priority: P1)

**Goal**: Add a new instructions pane above the story pane with defined copy and styling.

**Independent Test**: Load the game page and verify the pane appears above the story panel with the specified text and style.

### Implementation

- [ ] T001 [US1] Add instructions section markup in `frontend/index.html` above the story pane.
- [ ] T002 [US1] Add instructions styling in `frontend/index.html` to match the story pane.
- [ ] T003 [US1] Update instructions copy in `frontend/src/i18n.js` and remove stun line from controls text.

---

## Phase 4: User Story 2 - Notice toast visibility (Priority: P2)

**Goal**: Make toast notifications visually prominent.

**Independent Test**: Trigger toast messages and verify they are more visible.

### Implementation

- [ ] T004 [US2] Adjust toast styling in `frontend/index.html` and/or `frontend/src/game/renderer.js` to make messages pop.
