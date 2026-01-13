# Implementation Plan: FOMO Demon, Cast, and Event Log

**Branch**: `007-fomo-demon-log` | **Date**: 2026-01-13 | **Spec**: /Users/magnus/src/Work/VibeFixer/specs/007-fomo-demon-log/spec.md
**Input**: Feature specification from `/Users/magnus/src/Work/VibeFixer/specs/007-fomo-demon-log/spec.md`

## Summary

Add the FOMO Demon end-state logic, blocker count, event log panel, and cast/credits section to increase narrative feedback and visibility of game events.

## Technical Context

**Language/Version**: JavaScript (Node.js 20+ for backend, ES modules in browser)  
**Primary Dependencies**: None (vanilla JS, Node.js built-ins)  
**Storage**: N/A  
**Testing**: Manual browser testing (no automated suite yet)  
**Target Platform**: Browser client + Node.js server on Linux  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: 60 fps client-side rendering  
**Constraints**: Single-screen 1024x683 play area; blocker placements must remain breakable  
**Scale/Scope**: Single session, single level per round

## Constitution Check

No explicit constitution rules are defined in `/Users/magnus/src/Work/VibeFixer/.specify/memory/constitution.md` (placeholders only). No gates to enforce.

## Project Structure

### Documentation (this feature)

```text
/Users/magnus/src/Work/VibeFixer/specs/007-fomo-demon-log/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
/Users/magnus/src/Work/VibeFixer/backend/src/
├── game/
│   ├── level-generator.js
│   ├── level-validator.js
│   ├── scoring.js
│   └── session-store.js
└── api/
    └── sessions.js

/Users/magnus/src/Work/VibeFixer/frontend/src/
├── game/
│   ├── game-loop.js
│   ├── interactions.js
│   ├── physics.js
│   ├── collision.js
│   └── renderer.js
├── ui/
│   └── hud.js
└── app.js

/Users/magnus/src/Work/VibeFixer/frontend/index.html
```

**Structure Decision**: Web application with UI adjustments in `frontend/index.html` and game state updates in `frontend/src/game/*`.

## Phase 0: Outline & Research

### Research Tasks

No external research required; decisions are bounded by existing game logic and spec.

### Decisions

- **Decision**: Determine FOMO Demon state from end-of-round counts already tracked on the client.  
  **Rationale**: Keeps logic client-side without new backend calls.  
  **Alternatives considered**: Backend computation; rejected to keep scope small.

- **Decision**: Implement event log as a lightweight in-memory list with a fixed max length.  
  **Rationale**: Maintains performance and avoids persistent storage.  
  **Alternatives considered**: Full history; rejected due to clutter.

## Phase 1: Design & Contracts

### Data Model

Documented in `/Users/magnus/src/Work/VibeFixer/specs/007-fomo-demon-log/data-model.md`.

### API Contracts

No new endpoints or contract changes required. Placeholder documented at `/Users/magnus/src/Work/VibeFixer/specs/007-fomo-demon-log/contracts/README.md`.

### Quickstart

Documented in `/Users/magnus/src/Work/VibeFixer/specs/007-fomo-demon-log/quickstart.md`.

### Constitution Check (Post-Design)

No constitution gates to re-evaluate.

## Phase 2: Task Planning

Tasks will be generated in `/Users/magnus/src/Work/VibeFixer/specs/007-fomo-demon-log/tasks.md` via `/speckit.tasks`.
