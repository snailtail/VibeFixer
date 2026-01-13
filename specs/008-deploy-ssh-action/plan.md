# Implementation Plan: Automated SSH Deployment

**Branch**: `008-deploy-ssh-action` | **Date**: 2026-01-13 | **Spec**: /Users/magnus/src/Work/VibeFixer/specs/008-deploy-ssh-action/spec.md
**Input**: Feature specification from `/specs/008-deploy-ssh-action/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Automate deployments on updates to main using SSH-based GitHub Actions, deploying containerized services to `~/vibefixerapp` on the Ubuntu server while keeping local run workflows unchanged.

## Technical Context

**Language/Version**: JavaScript (ES2022) for client; Node.js 20+ for server  
**Primary Dependencies**: None (vanilla JS, Node.js built-ins)  
**Storage**: In-memory session store (no external DB)  
**Testing**: Manual testing (no automated test harness)  
**Target Platform**: Browser client + Node.js server on Linux with Docker runtime  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: Service starts within a few seconds after deployment; gameplay remains responsive  
**Constraints**: Deploy via SSH secrets; install under `~/vibefixerapp`; backend listens on port 3333; local dev unchanged  
**Scale/Scope**: Single server instance with one running backend service

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- No enforceable constitution rules found (constitution template contains placeholders). Proceeding without additional gates.

## Project Structure

### Documentation (this feature)

```text
specs/008-deploy-ssh-action/
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
│   └── server.js

frontend/
├── index.html
├── assets/
└── src/

.github/
└── workflows/
```

**Structure Decision**: Web application with separate `backend/` and `frontend/` directories, plus GitHub Actions workflow under `.github/workflows/`.

## Phase 0: Outline & Research

### Research Tasks

- Confirm deployment strategy using Docker Compose on the remote host.
- Decide on SSH-based sync method (rsync/scp) for shipping the repo to `~/vibefixerapp`.
- Establish environment configuration for backend port 3333 without altering local workflows.

### Output

- `specs/008-deploy-ssh-action/research.md`

## Phase 1: Design & Contracts

### Data Model

Deployment feature adds no new runtime data entities beyond existing sessions. Documented for completeness.

### Contracts

No new API contracts; deployment affects runtime and infrastructure only.

### Quickstart

Document local run steps (unchanged) and deployment verification steps.

### Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh codex` to record any new deployment technologies.

### Output

- `specs/008-deploy-ssh-action/data-model.md`
- `specs/008-deploy-ssh-action/contracts/README.md`
- `specs/008-deploy-ssh-action/quickstart.md`

## Constitution Check (Post-Design)

- No enforceable constitution rules found; no violations introduced.

## Phase 2: Task Planning

- To be produced by `/speckit.tasks` after this plan is finalized.
