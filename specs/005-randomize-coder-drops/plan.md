# Implementation Plan: Randomized Coder Drops

**Branch**: `005-randomize-coder-drops` | **Date**: 2026-01-13 | **Spec**: /Users/magnus/src/Work/VibeFixer/specs/005-randomize-coder-drops/spec.md
**Input**: Feature specification from `/Users/magnus/src/Work/VibeFixer/specs/005-randomize-coder-drops/spec.md`

## Summary

Randomize coder spawn positions, initial directions, and the second coder’s spawn time, while varying coder movement speed so drop locations change organically without leaving play bounds.

## Technical Context

**Language/Version**: JavaScript (Node.js 20+ for backend, ES modules in browser)  
**Primary Dependencies**: None (vanilla JS, Node.js built-ins)  
**Storage**: N/A  
**Testing**: Manual browser testing (no automated suite yet)  
**Target Platform**: Browser client + Node.js server on Linux  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: 60 fps client-side rendering  
**Constraints**: Single-screen 1024x683 play area, no scrolling, keep spawns/drops within bounds  
**Scale/Scope**: Single session, single level per round

## Constitution Check

No explicit constitution rules are defined in `/Users/magnus/src/Work/VibeFixer/.specify/memory/constitution.md` (placeholders only). No gates to enforce.

## Project Structure

### Documentation (this feature)

```text
/Users/magnus/src/Work/VibeFixer/specs/005-randomize-coder-drops/
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
└── ui/
    └── hud.js
```

**Structure Decision**: Web application with separate `backend/` and `frontend/` roots; changes are expected in `frontend/src/game/game-loop.js` with potential helper logic shared in `backend/src/game/` if needed.

## Phase 0: Outline & Research

### Research Tasks

No external research required; decisions are bounded by existing game logic and spec.

### Decisions

- **Decision**: Randomize coder spawn X within the playable range, clamped away from the edges.  
  **Rationale**: Ensures coders appear in different positions while remaining reachable.  
  **Alternatives considered**: Fixed spawn points; rejected due to predictability.

- **Decision**: Randomize the first coder’s initial movement direction and vary the second coder’s spawn time around the nominal target.  
  **Rationale**: Adds early-round variation and avoids a perfectly predictable mid-round spike.  
  **Alternatives considered**: Fixed direction/time; rejected due to repetitive feel.

- **Decision**: Vary coder movement speed within a bounded range and update it periodically.  
  **Rationale**: Produces unpredictable drop locations while keeping the drop cadence stable.  
  **Alternatives considered**: Randomizing drop intervals; rejected to keep cadence consistent.

- **Decision**: Spawn artifacts at the coder’s current X position.  
  **Rationale**: Keeps drops visually tied to the coder while allowing location variation via movement.  
  **Alternatives considered**: Adding random drop offsets; rejected for predictability mismatch.

## Phase 1: Design & Contracts

### Data Model

Documented in `/Users/magnus/src/Work/VibeFixer/specs/005-randomize-coder-drops/data-model.md`.

### API Contracts

No new endpoints or contract changes required. Placeholder documented at `/Users/magnus/src/Work/VibeFixer/specs/005-randomize-coder-drops/contracts/README.md`.

### Quickstart

Documented in `/Users/magnus/src/Work/VibeFixer/specs/005-randomize-coder-drops/quickstart.md`.

### Constitution Check (Post-Design)

No constitution gates to re-evaluate.

## Phase 2: Task Planning

Tasks will be generated in `/Users/magnus/src/Work/VibeFixer/specs/005-randomize-coder-drops/tasks.md` via `/speckit.tasks`.
