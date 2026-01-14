# Implementation Plan: Admin Console Upgrade

**Branch**: `021-admin-console` | **Date**: 2026-01-14 | **Spec**: /Users/magnus/src/Work/VibeFixer/specs/021-admin-console/spec.md
**Input**: Feature specification from `/specs/021-admin-console/spec.md`

## Summary

Implement an admin session cookie (30-minute TTL), separate admin pages for log viewer, high score management, and game settings, plus CRUD for broadcast notices that display as toast messages on `/`.

## Technical Context

**Language/Version**: JavaScript (Node.js 20.x)  
**Primary Dependencies**: Node.js standard library, `better-sqlite3` for storage  
**Storage**: SQLite database on persistent volume  
**Testing**: Manual verification; no automated tests currently  
**Target Platform**: Linux server (Docker container)  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: Admin pages should load within 2 seconds for recent data  
**Constraints**: Admin UI English only; admin session must expire after 30 minutes; notices must honor valid-from/valid-to; player speed range 50%–150%  
**Scale/Scope**: Single server, modest traffic

## Constitution Check

No enforceable principles defined in `/Users/magnus/src/Work/VibeFixer/.specify/memory/constitution.md` (placeholders only). Gate passes by default.

## Project Structure

### Documentation (this feature)

```text
specs/021-admin-console/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   ├── security/
│   ├── storage/
│   └── server.js

frontend/
├── src/
│   ├── game/
│   ├── admin/
│   └── app.js
```

**Structure Decision**: Web application with `backend/` and `frontend/` directories.

## Complexity Tracking

> No constitution violations to justify.
