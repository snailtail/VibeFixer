# Feature Specification: Touchscreen Overlay Controls

**Feature Branch**: `015-touch-controls`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "Add touchscreen controls by overlaying a semi-transparent D-pad and jump/action buttons directly on top of the game canvas (absolute positioning inside the game container)."

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

### User Story 1 - Use Touch Controls on Small Screens (Priority: P1)

As a mobile player, I want on-screen touch controls overlaid on the game canvas so I can play without a keyboard.

**Why this priority**: Touch support is the core value of the feature and enables mobile play.

**Independent Test**: Open the game on a touch device and verify movement, jump, and action work using the overlay controls.

**Acceptance Scenarios**:

1. **Given** the game is running on a touch device, **When** the player presses the D-pad, **Then** the character moves in the corresponding direction.
2. **Given** the game is running on a touch device, **When** the player presses jump or action, **Then** the character jumps or picks up/drops code.

---

### User Story 2 - Preserve Desktop Controls (Priority: P2)

As a desktop player, I want keyboard controls to continue working without interference from the touch UI.

**Why this priority**: Desktop play should not regress when touch controls are added.

**Independent Test**: Play with a keyboard and verify that movement, jump, and action still respond normally.

**Acceptance Scenarios**:

1. **Given** the game is running on desktop, **When** the player uses the keyboard, **Then** the game responds exactly as before.

### Edge Cases

- Touch controls should not block visibility of important game elements.
- Multi-touch input should allow moving and jumping at the same time.
- Touch UI should not cause page scrolling or zooming while playing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The UI MUST render an on-screen D-pad and jump/action buttons over the game canvas.
- **FR-002**: The overlay controls MUST be semi-transparent and positioned inside the game container.
- **FR-003**: Touch input MUST map to existing movement, jump, and action controls.
- **FR-004**: The touch overlay MUST not interfere with keyboard controls.
- **FR-005**: The touch overlay MUST prevent page scrolling/zooming during gameplay.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Touch users can complete a full game session using only the overlay controls.
- **SC-002**: Desktop keyboard controls continue to work with no observable regression.
- **SC-003**: The touch overlay is visible and usable on common tablet and phone resolutions.
- **SC-004**: No page scrolling or zooming occurs during touch gameplay.

### Assumptions & Dependencies

- Assumes the game container can host absolutely positioned overlay elements.
- Assumes existing input state can be updated from touch events.
