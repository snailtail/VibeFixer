# Implementation Plan: Sessions Today Count

**Branch**: `029-sessions-today-count` | **Date**: 2026-01-15 | **Spec**: /data/src/VibeFixer/specs/029-sessions-today-count/spec.md
**Input**: Feature specification from `/specs/029-sessions-today-count/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add a "Sessions Today" count to the System Stats pane on `/admin`, sourced from session start times within the system-defined "today" window and surfaced via the existing system stats endpoint.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: JavaScript (Node.js 20 for backend, ES2022 for frontend)  
**Primary Dependencies**: Node.js standard library, `better-sqlite3`  
**Storage**: SQLite database file (sessions table on persistent volume)  
**Testing**: No automated test framework in repo  
**Target Platform**: Linux server backend + modern desktop/mobile browsers for admin UI  
**Project Type**: Web application (backend + frontend)  
**Performance Goals**: Admin System Stats refresh completes fast enough for a 20s polling interval  
**Constraints**: Reuse the system-defined "today" boundary and timezone  
**Scale/Scope**: Daily session counts over existing session history

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution file contains placeholders only, so no enforceable gates apply. Gate passes for Phase 0 and is unchanged after Phase 1.

## Project Structure

### Documentation (this feature)

```text
specs/029-sessions-today-count/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
backend/
├── src/
│   ├── api/
│   ├── game/
│   └── storage/

frontend/
├── src/
│   └── admin/
```

**Structure Decision**: Web application layout with `/backend/src` for API/session logic and `/frontend/src/admin` for admin UI updates.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
