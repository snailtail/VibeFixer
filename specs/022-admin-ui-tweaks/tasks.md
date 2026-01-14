# Tasks: Admin UI tweaks, high score admin list, logo update

**Input**: Design documents from `/specs/022-admin-ui-tweaks/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Phase 3: User Story 1 - Manage all high scores in admin (Priority: P1)

**Goal**: List all high scores and allow admins to choose one to edit/delete.

**Independent Test**: Open `/admin/high-scores`, confirm multiple entries render, select one, edit/delete, and verify the list updates.

### Implementation

- [ ] T001 [US1] Update admin high score page layout in `frontend/admin-high-scores.html` to support a selectable list + detail editor.
- [ ] T002 [US1] Refactor admin high score UI behavior in `frontend/src/admin/high-scores.js` to load all scores, allow selection, and apply edit/delete to the selected entry.
- [ ] T003 [P] [US1] Adjust admin high score styling for list + detail panel in `frontend/admin.css`.

---

## Phase 4: User Story 2 - Consolidated admin system stats (Priority: P2)

**Goal**: Remove system stats from the game UI and show them in the admin UI without duplicates.

**Independent Test**: Load the game UI (no system stats panel). Load `/admin` and confirm the system stats panel shows each stat once.

### Implementation

- [ ] T004 [US2] Remove system stats markup/styles from `frontend/index.html` and update any related selectors.
- [ ] T005 [US2] Remove system stats updates/fetches from `frontend/src/app.js`.
- [ ] T006 [US2] Add system stats panel to `frontend/admin.html` with admin-only labels.
- [ ] T007 [US2] Add admin stats fetch/render module in `frontend/src/admin/overview.js` (or similar) using `/api/system/stats` and `frontend/src/admin/session.js`.
- [ ] T008 [P] [US2] Add styling for the admin system stats panel in `frontend/admin.css`.

---

## Phase 5: User Story 3 - Retro logo update (Priority: P3)

**Goal**: Match logo text font and neon color feel to the High Scores header while preserving the logo border color.

**Independent Test**: Load the game UI and verify the logo text styling matches the High Scores header and the border color is unchanged.

### Implementation

- [ ] T009 [US3] Update logo text styling in `frontend/index.html` to use the High Scores header font/color while keeping the existing border color.
