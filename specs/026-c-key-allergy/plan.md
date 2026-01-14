# Implementation Plan: C-key allergy easter egg

**Branch**: `026-c-key-allergy` | **Date**: 2026-01-14 | **Spec**: `/Users/magnus/src/Work/VibeFixer/specs/026-c-key-allergy/spec.md`
**Input**: Feature specification from `/specs/026-c-key-allergy/spec.md`

## Summary

Add a hidden double-tap C key easter egg that slows vibe coders by 40% for the rest of the session, with a toast and log entry.

## Technical Context

**Language/Version**: JavaScript (Node.js 20 for backend, ES2022 for frontend)  
**Primary Dependencies**: Node.js standard library, `better-sqlite3`  
**Storage**: SQLite (persistent DB file)  
**Testing**: `npm test && npm run lint`  
**Target Platform**: Linux server + modern browsers  
**Project Type**: Web application (backend + frontend)  
**Performance Goals**: 60 fps for game UI  
**Constraints**: Hidden feature; no changes to instructions/controls UI

## Constitution Check

No enforceable principles defined in `/Users/magnus/src/Work/VibeFixer/.specify/memory/constitution.md` (placeholders only). Gate passes by default.

## Project Structure

### Documentation (this feature)

```text
specs/026-c-key-allergy/
├── plan.md              # This file (/speckit.plan command output)
├── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── game/
│   ├── i18n.js
│   └── game/input.js
```

**Structure Decision**: Implement input detection in `frontend/src/game/input.js` or game loop, apply debuff in `frontend/src/game/game-loop.js`, and update i18n for toast/log messages.

## Design Notes

- Track C key press timestamps in state.
- Add a per-session flag to avoid retriggering.
- Apply a speed multiplier to all coders; also apply to new coders on spawn.
- Use existing toast/log systems for messaging.
