# Implementation Plan: Language Toggle

**Branch**: `012-language-toggle` | **Date**: 2026-01-13 | **Spec**: /Users/magnus/src/Work/VibeFixer/specs/012-language-toggle/spec.md
**Input**: Feature specification from `/specs/012-language-toggle/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add a language selector (English/Swedish) that updates UI text immediately and persists the preference across reloads.

## Technical Context

**Language/Version**: JavaScript (ES2022) for client; Node.js 20+ for server  
**Primary Dependencies**: None (vanilla JS, Node.js built-ins)  
**Storage**: In-memory session store (no external DB)  
**Testing**: Manual testing (no automated test harness)  
**Target Platform**: Browser client + Node.js server on Linux  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: UI updates within 1 second of language change  
**Constraints**: Default to English; persist selection in local storage  
**Scale/Scope**: Single-page UI localization

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- No enforceable constitution rules found (constitution template contains placeholders). Proceeding without additional gates.

## Project Structure

### Documentation (this feature)

```text
specs/012-language-toggle/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── index.html
├── src/
│   ├── app.js
│   ├── game/
│   └── ui/
```

**Structure Decision**: Frontend updates to add language selection and text mapping.

## Phase 0: Outline & Research

### Research Tasks

- Inventory all user-visible strings that need translation.
- Decide where to centralize translations and persistence logic.

### Output

- `specs/012-language-toggle/research.md`

## Phase 1: Design & Contracts

### Data Model

Language preference stored in local storage, and translation map held in client code.

### Contracts

No API changes required; localization is client-side only.

### Quickstart

Document how to verify language switching and persistence.

### Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh codex` to record localization changes if needed.

### Output

- `specs/012-language-toggle/data-model.md`
- `specs/012-language-toggle/contracts/README.md`
- `specs/012-language-toggle/quickstart.md`

## Constitution Check (Post-Design)

- No enforceable constitution rules found; no violations introduced.

## Phase 2: Task Planning

- To be produced by `/speckit.tasks` after this plan is finalized.
