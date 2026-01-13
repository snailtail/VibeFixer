# Implementation Plan: Imp Ediment Obstacles

**Branch**: `006-imp-obstacle-npc` | **Date**: 2026-01-13 | **Spec**: /Users/magnus/src/Work/VibeFixer/specs/006-imp-obstacle-npc/spec.md
**Input**: Feature specification from `/Users/magnus/src/Work/VibeFixer/specs/006-imp-obstacle-npc/spec.md`

## Summary

Add Imp Ediment NPC appearances that teleport into the scene, play a whoosh sound, and place 1–5 obstacle blocks within strict placement rules and timing windows to raise difficulty.

## Technical Context

**Language/Version**: JavaScript (Node.js 20+ for backend, ES modules in browser)  
**Primary Dependencies**: None (vanilla JS, Node.js built-ins)  
**Storage**: N/A  
**Testing**: Manual browser testing (no automated suite yet)  
**Target Platform**: Browser client + Node.js server on Linux  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: 60 fps client-side rendering  
**Constraints**: Single-screen 1024x683 play area; obstacle placement must avoid player, trash, artifacts  
**Scale/Scope**: Single session, single level per round

## Constitution Check

No explicit constitution rules are defined in `/Users/magnus/src/Work/VibeFixer/.specify/memory/constitution.md` (placeholders only). No gates to enforce.

## Project Structure

### Documentation (this feature)

```text
/Users/magnus/src/Work/VibeFixer/specs/006-imp-obstacle-npc/
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

**Structure Decision**: Web application with separate `backend/` and `frontend/` roots; the NPC logic and placement rules live in `frontend/src/game/game-loop.js` and rendering in `frontend/src/game/renderer.js`.

## Phase 0: Outline & Research

### Research Tasks

No external research required; decisions are bounded by existing game logic and spec.

### Decisions

- **Decision**: Implement Imp Ediment entirely client-side, placing obstacles by mutating the active terrain list.  
  **Rationale**: Keeps gameplay responsive without adding new backend endpoints.  
  **Alternatives considered**: Backend placement; rejected due to complexity.

- **Decision**: Use a placement search with bounded attempts per block to satisfy collision rules.  
  **Rationale**: Ensures placements remain valid without blocking gameplay.  
  **Alternatives considered**: Deterministic grid; rejected for predictability.

## Phase 1: Design & Contracts

### Data Model

Documented in `/Users/magnus/src/Work/VibeFixer/specs/006-imp-obstacle-npc/data-model.md`.

### API Contracts

No new endpoints or contract changes required. Placeholder documented at `/Users/magnus/src/Work/VibeFixer/specs/006-imp-obstacle-npc/contracts/README.md`.

### Quickstart

Documented in `/Users/magnus/src/Work/VibeFixer/specs/006-imp-obstacle-npc/quickstart.md`.

### Constitution Check (Post-Design)

No constitution gates to re-evaluate.

## Phase 2: Task Planning

Tasks will be generated in `/Users/magnus/src/Work/VibeFixer/specs/006-imp-obstacle-npc/tasks.md` via `/speckit.tasks`.
