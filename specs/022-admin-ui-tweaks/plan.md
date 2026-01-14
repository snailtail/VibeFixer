# Implementation Plan: Admin UI tweaks, high score admin list, logo update

**Branch**: `022-admin-ui-tweaks` | **Date**: 2026-01-14 | **Spec**: `/Users/magnus/src/Work/VibeFixer/specs/022-admin-ui-tweaks/spec.md`
**Input**: Feature specification from `/specs/022-admin-ui-tweaks/spec.md`

## Summary

Update admin UI to list and manage all high scores, move system stats into the admin UI without duplication, and restyle the game logo text to match the High Scores header font/color while preserving the current logo border color.

## Technical Context

**Language/Version**: JavaScript (Node.js 20 for backend, ES2022 for frontend)  
**Primary Dependencies**: Node.js standard library, `better-sqlite3`  
**Storage**: SQLite (persistent DB file)  
**Testing**: `npm test && npm run lint`  
**Target Platform**: Linux server + modern browsers  
**Project Type**: Web application (backend + frontend)  
**Performance Goals**: 60 fps for game UI; admin UI renders without noticeable delay  
**Constraints**: No external DB; use existing API endpoints and storage patterns  
**Scale/Scope**: Small admin interface; high score list likely < 1k entries

## Constitution Check

No enforceable principles defined in `/Users/magnus/src/Work/VibeFixer/.specify/memory/constitution.md` (placeholders only). Gate passes by default.

## Project Structure

### Documentation (this feature)

```text
specs/022-admin-ui-tweaks/
├── plan.md              # This file (/speckit.plan command output)
├── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   ├── services/
│   └── storage/

frontend/
├── src/
│   ├── admin/
│   ├── game/
│   ├── ui/
│   └── assets/
```

**Structure Decision**: Web application with separate `backend/` and `frontend/` directories. Admin UI lives under `frontend/src/admin/`, game UI under `frontend/src/game/`.
