# Implementation Plan: Admin Log Viewer

**Branch**: `020-admin-log-viewer` | **Date**: 2026-01-14 | **Spec**: /Users/magnus/src/Work/VibeFixer/specs/020-admin-log-viewer/spec.md
**Input**: Feature specification from `/specs/020-admin-log-viewer/spec.md`

## Summary

Add an admin-only log viewer with authentication, filters for time/category/severity, search, and export. Logs include security and gameplay events with a 7-day retention window for viewing.

## Technical Context

**Language/Version**: JavaScript (Node.js 20.x)  
**Primary Dependencies**: Node.js standard library, `better-sqlite3` for storage  
**Storage**: SQLite database on persistent volume  
**Testing**: Manual verification; no automated tests currently  
**Target Platform**: Linux server (Docker container)  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: Log viewer should load recent entries quickly and avoid blocking gameplay  
**Constraints**: Must not expose logs publicly; must redact sensitive values  
**Scale/Scope**: Single server, modest traffic, 7-day log view

## Constitution Check

No enforceable principles defined in `/Users/magnus/src/Work/VibeFixer/.specify/memory/constitution.md` (placeholders only). Gate passes by default.

## Project Structure

### Documentation (this feature)

```text
specs/020-admin-log-viewer/
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
│   └── app.js
```

**Structure Decision**: Web application with `backend/` and `frontend/` directories.

## Complexity Tracking

> No constitution violations to justify.
