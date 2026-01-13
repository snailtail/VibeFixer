# Tasks: Language Toggle

**Feature**: Language Toggle
**Spec**: /Users/magnus/src/Work/VibeFixer/specs/012-language-toggle/spec.md
**Plan**: /Users/magnus/src/Work/VibeFixer/specs/012-language-toggle/plan.md

## Phase 1: Setup

- [ ] T001 Create translation map and language helpers in `/Users/magnus/src/Work/VibeFixer/frontend/src/i18n.js`

## Phase 2: Foundational

- [ ] T002 Identify all translatable UI strings in `/Users/magnus/src/Work/VibeFixer/frontend/index.html` and `/Users/magnus/src/Work/VibeFixer/frontend/src/ui/hud.js`

## Phase 3: User Story 1 (P1) - Switch language

**Story Goal**: Allow switching UI between English and Swedish.

**Independent Test Criteria**: Selecting a language updates all visible UI text.

- [ ] T003 [US1] Add language selector control to `/Users/magnus/src/Work/VibeFixer/frontend/index.html`
- [ ] T004 [US1] Wire language selector to update UI text in `/Users/magnus/src/Work/VibeFixer/frontend/src/app.js`
- [ ] T005 [US1] Apply translations to HUD labels in `/Users/magnus/src/Work/VibeFixer/frontend/src/ui/hud.js`
- [ ] T006 [US1] Apply translations to intro/story, cast headers, credits headers, controls label, and Game Events label in `/Users/magnus/src/Work/VibeFixer/frontend/index.html`

## Phase 4: User Story 2 (P2) - Persist language choice

**Story Goal**: Persist the language preference across reloads.

**Independent Test Criteria**: Language remains after refresh and defaults to English when missing/invalid.

- [ ] T007 [US2] Store and load language preference in `/Users/magnus/src/Work/VibeFixer/frontend/src/i18n.js`
- [ ] T008 [US2] Initialize UI with stored language in `/Users/magnus/src/Work/VibeFixer/frontend/src/app.js`

## Phase 5: Polish & Cross-Cutting

- [ ] T009 Add language selection notes to `/Users/magnus/src/Work/VibeFixer/specs/012-language-toggle/quickstart.md`

## Dependencies

- US1 depends on T001-T002.
- US2 depends on T007.

## Parallel Execution Examples

- T003 and T006 can proceed after T001.
- T004 and T005 can proceed after T003.

## Implementation Strategy

Start with translation map and helpers (T001), inventory strings (T002), add selector and wiring (T003-T004), apply translations (T005-T006), persist selection (T007-T008), and update quickstart notes (T009).
