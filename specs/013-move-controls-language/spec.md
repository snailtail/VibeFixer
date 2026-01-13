# Feature Specification: Move Controls and Language Below Game

**Feature Branch**: `013-move-controls-language`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "I want to move the info about controls, and the language selector to below the game area, just above the story"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Reposition Controls and Language (Priority: P1)

As a player, I want the controls and language selector placed below the game area so the game layout feels cleaner and the guidance appears in a logical reading order.

**Why this priority**: This is the requested visual change and is the core value of the feature.

**Independent Test**: Load the page and verify the controls and language selector appear below the game area and above the story without overlapping the game or story.

**Acceptance Scenarios**:

1. **Given** the game page is loaded, **When** the UI is rendered, **Then** the controls and language selector appear below the game area and above the story section.
2. **Given** the game page is loaded, **When** the player scrolls to the story, **Then** the controls and language selector are immediately above it.

---

### User Story 2 - Language Selector Still Works (Priority: P2)

As a player, I want the language selector to keep working and persist my choice after being moved so I can still play in my preferred language.

**Why this priority**: The selector must remain functional after the layout change to avoid regressions.

**Independent Test**: Change the language and reload the page to confirm the selection persists and the text remains translated.

**Acceptance Scenarios**:

1. **Given** the language selector is visible below the game, **When** the user switches languages, **Then** all UI strings update immediately.
2. **Given** the user selected a language, **When** the page is refreshed, **Then** the previously selected language remains active.

### Edge Cases

- On small screens, controls and language selector should not overlap the game area or story.
- Long translations should wrap without breaking the layout or hiding the selector.

### Assumptions & Dependencies

- Assumes the controls and language selector already exist and remain functional.
- No external dependencies beyond existing frontend layout and styles.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The controls text MUST be positioned below the game area and above the story section.
- **FR-002**: The language selector MUST be positioned adjacent to the controls in the same area below the game.
- **FR-003**: The layout MUST avoid overlapping the game area, story section, or side panel at common viewport sizes.
- **FR-004**: The language selector MUST continue to change UI text immediately after selection.
- **FR-005**: The selected language MUST persist across page reloads.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Controls text and language selector render below the game area and above the story on desktop and mobile layouts.
- **SC-002**: Switching languages updates all visible UI strings within 1 second.
- **SC-003**: Language preference persists after a page reload in 100% of manual tests.
- **SC-004**: No layout overlap or clipped controls/selector is observed in manual QA at common viewport sizes.
