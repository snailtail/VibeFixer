# Implementation Plan: Stun vibe coder on hit

**Branch**: `024-stun-vibe-coder-hit` | **Date**: 2026-01-14 | **Spec**: `/Users/magnus/src/Work/VibeFixer/specs/024-stun-vibe-coder-hit/spec.md`
**Input**: Feature specification from `/specs/024-stun-vibe-coder-hit/spec.md`

## Summary

Add a gameplay mechanic where a carried artifact can stun a single vibe coder for 10 seconds, freezing movement and drops, with flicker visuals and game log entries on stun and recovery.

## Technical Context

**Language/Version**: JavaScript (Node.js 20 for backend, ES2022 for frontend)  
**Primary Dependencies**: Node.js standard library, `better-sqlite3`  
**Storage**: SQLite (persistent DB file)  
**Testing**: `npm test && npm run lint`  
**Target Platform**: Linux server + modern browsers  
**Project Type**: Web application (backend + frontend)  
**Performance Goals**: 60 fps for game UI  
**Constraints**: No external DB; use existing game loop patterns  
**Scale/Scope**: Add transient state to in-memory vibe coder entities

## Constitution Check

No enforceable principles defined in `/Users/magnus/src/Work/VibeFixer/.specify/memory/constitution.md` (placeholders only). Gate passes by default.

## Project Structure

### Documentation (this feature)

```text
specs/024-stun-vibe-coder-hit/
├── plan.md              # This file (/speckit.plan command output)
├── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   └── game/

frontend/
├── src/
│   ├── game/
│   └── ui/
```

**Structure Decision**: Gameplay logic lives in `frontend/src/game/` with rendering handled by `frontend/src/game/renderer.js`.

## Design Notes

- Stun state should be stored per coder (timestamp or remaining duration).
- Stunned coders should skip movement and drop logic.
- Flicker can be implemented in renderer by alternating sprite opacity while stunned.
- Collision detection should require the player to be carrying an artifact.
- Log messages should be added via the existing event log helper.
