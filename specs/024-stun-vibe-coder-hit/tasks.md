# Tasks: Stun vibe coder on hit

**Input**: Design documents from `/specs/024-stun-vibe-coder-hit/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)

## Phase 3: User Story 1 - Stun a coder with a carried artifact (Priority: P1)

**Goal**: Stun a specific coder on collision while carrying an artifact, freeze movement/drops for 10s, flicker, and log events.

**Independent Test**: Carry an artifact, collide with a coder, observe stun for 10s with flicker and log messages, then resume.

### Implementation

- [ ] T001 [US1] Add per-coder stun state and timer handling in `frontend/src/game/game-loop.js`.
- [ ] T002 [US1] Detect collision between carried artifact/player and a coder to trigger stun in `frontend/src/game/game-loop.js`.
- [ ] T003 [US1] Skip coder movement and drop behavior when stunned in `frontend/src/game/game-loop.js`.
- [ ] T004 [US1] Add flicker rendering for stunned coder sprites in `frontend/src/game/renderer.js`.
- [ ] T005 [US1] Add Game Events log messages for stun and recovery in `frontend/src/game/game-loop.js` and strings in `frontend/src/i18n.js`.
