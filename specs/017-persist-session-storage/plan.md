# Implementation Plan: Persistent Backend Storage

**Branch**: `017-persist-session-storage` | **Date**: 2026-01-14 | **Spec**: /Users/magnus/src/Work/VibeFixer/specs/017-persist-session-storage/spec.md
**Input**: Feature specification from `/specs/017-persist-session-storage/spec.md`

## Summary

Persist session and stats data across restarts using a host-mounted SQLite database file, with safe startup recovery and future-ready storage for additional data types.

## Technical Context

**Language/Version**: Node.js 20 (current runtime)
**Primary Dependencies**: better-sqlite3, existing Node HTTP server
**Storage**: SQLite database file on a host-mounted volume
**Testing**: Manual smoke tests (no existing automated test harness)
**Target Platform**: Linux server (Docker) + local dev
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Keep startup under 2 seconds with typical session counts
**Constraints**: Data must survive container recreation; storage path must be writable on host
**Scale/Scope**: Low to moderate session volume; future data types (e.g., high scores)

## Constitution Check

No enforceable constitution rules detected (template placeholders only). Proceeding without gates.

## Project Structure

### Documentation (this feature)

```text
specs/017-persist-session-storage/
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
│   ├── game/
│   ├── storage/
│   └── server.js
frontend/
└── src/
```

**Structure Decision**: Web application (frontend + backend) with a new backend storage module under `backend/src/storage/`.

## Phase 0: Outline & Research

### Research Tasks

1. Research Node SQLite drivers for container compatibility and minimal operational friction.
2. Define host volume path conventions for persisted data.

### Output

- `research.md` with decisions and rationale

### Research Status

Unknowns resolved in `research.md`.

## Phase 1: Design & Contracts

### Data Model

Define tables for sessions, artifacts, and stats snapshots (if needed) with minimal schema to restore session state and compute stats.

### API Contracts

No new external API endpoints required; session and stats endpoints remain unchanged.

### Quickstart

Document local run steps with a mounted data directory and a simple restart test to verify persistence.

### Agent Context Update

Run update script to capture new storage dependency.

## Phase 2: Planning Gate

Stop after Phase 1 outputs; proceed to tasks in `/speckit.tasks`.
