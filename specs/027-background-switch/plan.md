# Implementation Plan: Background Switcher

**Branch**: `027-background-switch` | **Date**: 2026-01-15 | **Spec**: specs/027-background-switch/spec.md
**Input**: Feature specification from `/specs/027-background-switch/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add a keyboard-only background toggle (B key) that switches between kommun and danger backgrounds, shows a small active-background indicator, and remembers the last choice per device without affecting gameplay.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: JavaScript (ES2022) for client, Node.js 20 for server  
**Primary Dependencies**: None (vanilla JS, Node.js standard library)  
**Storage**: Local device preference (client-side)  
**Testing**: npm test (existing harness)  
**Target Platform**: Modern desktop browsers; Node.js 20 server  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: Maintain smooth 60 fps rendering during background switches  
**Constraints**: No on-screen background selector; keyboard-only toggle (B key)  
**Scale/Scope**: Single-player sessions; preference stored per device

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- No constitution rules defined for this repository (template placeholders only). No gates to evaluate.
- Post-Phase 1 check: No changes; still no gates to evaluate.

## Project Structure

### Documentation (this feature)

```text
specs/027-background-switch/
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
│   ├── security/
│   └── storage/

frontend/
├── src/
│   ├── game/
│   ├── ui/
│   └── admin/
```

**Structure Decision**: Web application with separate `backend/` and `frontend/` directories as shown above.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
