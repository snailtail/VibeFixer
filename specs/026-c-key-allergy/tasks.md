# Tasks: C-key allergy easter egg

**Input**: Design documents from `/specs/026-c-key-allergy/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)

## Phase 3: User Story 1 - Trigger C-key allergy debuff (Priority: P1)

**Goal**: Double-tap C within 1s to slow coders by 40% for the session, show toast, log event.

**Independent Test**: Double-tap C during a session, verify coders slow and toast/log appear once, and new coders spawn slowed.

### Implementation

- [ ] T001 [US1] Track C key double-tap window and trigger flag in `frontend/src/game/game-loop.js` (or input handling).
- [ ] T002 [US1] Apply 40% speed reduction to existing and future coders in `frontend/src/game/game-loop.js`.
- [ ] T003 [US1] Add toast message and log entry in `frontend/src/game/game-loop.js` and strings in `frontend/src/i18n.js`.
- [ ] T004 [US1] Ensure no instructions/controls mention the C-key easter egg.
