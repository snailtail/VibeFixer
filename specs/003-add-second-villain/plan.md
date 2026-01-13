# Implementation Plan: Second Vibe Coder + Toast

**Branch**: `003-add-second-villain` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-add-second-villain/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add a second vibe coder after 30 seconds to double artifact drops and show a non-blocking toast warning just before the second coder appears.

## Technical Context

**Language/Version**: JavaScript (ES2022) for client; Node.js 20 for server  
**Primary Dependencies**: Minimal HTTP server framework; browser Canvas 2D rendering  
**Storage**: In-memory session state (no persistence)  
**Testing**: Unit tests for timing logic + browser-based smoke test  
**Target Platform**: Modern desktop browsers; Linux server behind reverse proxy  
**Project Type**: Web application (frontend + lightweight backend)  
**Performance Goals**: 60 fps gameplay; toast render under 100ms  
**Constraints**: Second coder appears at 30 seconds; toast does not block input  
**Scale/Scope**: Single-player sessions; no accounts or persistent storage

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No enforceable gates found. The constitution file contains placeholders only, so no additional constraints apply.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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
│   ├── game/
│   └── services/
└── tests/

frontend/
├── src/
│   ├── game/
│   ├── ui/
│   └── assets/
└── tests/
```

**Structure Decision**: Web application with a lightweight backend for session state and a browser-based frontend for gameplay.

## Complexity Tracking

No constitution violations to justify.

## Phase 0: Outline & Research

- Confirm timing behavior for the toast and second coder spawn.
- Document decisions and alternatives in `research.md`.

## Phase 1: Design & Contracts

- Model coder timing and toast state in `data-model.md`.
- Define any required HTTP contracts in `/contracts/` (if needed).
- Provide a developer bootstrap in `quickstart.md`.
- Update agent context via `.specify/scripts/bash/update-agent-context.sh codex`.
- Re-check Constitution Check after design output.

## Constitution Check (Post-Design)

No enforceable gates found. The constitution file remains placeholder-only, so design artifacts are accepted.
