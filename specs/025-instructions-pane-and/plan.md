# Implementation Plan: Instructions pane and toast visibility

**Branch**: `025-instructions-pane-and` | **Date**: 2026-01-14 | **Spec**: `/Users/magnus/src/Work/VibeFixer/specs/025-instructions-pane-and/spec.md`
**Input**: Feature specification from `/specs/025-instructions-pane-and/spec.md`

## Summary

Add an instructions pane above the story pane, move stun guidance out of controls, and improve toast visibility.

## Technical Context

**Language/Version**: JavaScript (Node.js 20 for backend, ES2022 for frontend)  
**Primary Dependencies**: Node.js standard library, `better-sqlite3`  
**Storage**: SQLite (persistent DB file)  
**Testing**: `npm test && npm run lint`  
**Target Platform**: Linux server + modern browsers  
**Project Type**: Web application (backend + frontend)  
**Performance Goals**: 60 fps for game UI  
**Constraints**: Reuse existing UI styles and rendering flow  
**Scale/Scope**: Frontend layout and CSS only

## Constitution Check

No enforceable principles defined in `/Users/magnus/src/Work/VibeFixer/.specify/memory/constitution.md` (placeholders only). Gate passes by default.

## Project Structure

### Documentation (this feature)

```text
specs/025-instructions-pane-and/
├── plan.md              # This file (/speckit.plan command output)
├── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── index.html
├── src/
│   ├── app.js
│   └── i18n.js
```

**Structure Decision**: Update `frontend/index.html` for layout and styles, and `frontend/src/i18n.js` for copy.
