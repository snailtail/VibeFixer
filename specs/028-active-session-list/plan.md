# Implementation Plan: Active Session List

**Branch**: `028-active-session-list` | **Date**: 2026-01-15 | **Spec**: /Users/magnus/src/Work/VibeFixer/specs/028-active-session-list/spec.md
**Input**: Feature specification from `/specs/028-active-session-list/spec.md`

## Summary

Provide an admin-only active session list that surfaces key live-session details (identifier, status, start time, elapsed duration, score, remaining artifacts, player speed modifier) and refreshes within 4 seconds, with a clear empty state.

## Technical Context

**Language/Version**: JavaScript (Node.js 20 for backend, ES2022 for frontend)  
**Primary Dependencies**: Node.js standard library, better-sqlite3, vanilla browser JS  
**Storage**: In-memory session store with SQLite-backed session persistence (existing)  
**Testing**: `npm test` and `npm run lint`  
**Target Platform**: Node.js server + browser-based frontend  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: Active session list renders within 2 seconds for 95% of loads  
**Constraints**: Admin-only, read-only list; refresh interval <= 4 seconds; no session mutation from this view  
**Scale/Scope**: Single server, modest traffic, in-memory session tracking

## Constitution Check

No constitution rules are defined in `/Users/magnus/src/Work/VibeFixer/.specify/memory/constitution.md` beyond placeholders, so there are no active gates to evaluate.

## Project Structure

### Documentation (this feature)

```text
specs/028-active-session-list/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   └── game/

frontend/
├── src/
│   └── admin/
└── admin-*.html
```

**Structure Decision**: Web application with a Node.js backend and a browser admin UI under `frontend/`.

## Phase 0: Outline & Research

See `/Users/magnus/src/Work/VibeFixer/specs/028-active-session-list/research.md` for decisions and alternatives.

## Phase 1: Design & Contracts

See `/Users/magnus/src/Work/VibeFixer/specs/028-active-session-list/data-model.md`, `/Users/magnus/src/Work/VibeFixer/specs/028-active-session-list/contracts/active-sessions.yaml`, and `/Users/magnus/src/Work/VibeFixer/specs/028-active-session-list/quickstart.md`.

## Constitution Check (Post-Design)

No constitution rules are defined beyond placeholders; no gate checks required.
