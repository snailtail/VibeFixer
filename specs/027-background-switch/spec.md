# Feature Specification: Background Switcher

**Feature Branch**: `027-background-switch`  
**Created**: 2026-01-15  
**Status**: Draft  
**Input**: User description: "if i wanted to let the user switch between kommun_bg.png and danger_bg.png as the background image for the game"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choose a background before playing (Priority: P1)

As a player, I want to pick between the two background themes so the game looks the way I prefer before I start playing.

**Why this priority**: This is the core value of the feature and should work even if no other enhancements are added.

**Independent Test**: Can be fully tested by selecting a background option and confirming the game view shows that selection.

**Acceptance Scenarios**:

1. **Given** the game has not started, **When** the player selects the kommun background, **Then** the game view shows the kommun background.
2. **Given** the game has not started, **When** the player selects the danger background, **Then** the game view shows the danger background.
3. **Given** the game view is visible, **When** the player looks for background controls, **Then** no on-screen background selector is shown.

---

### User Story 2 - Switch backgrounds during play (Priority: P2)

As a player, I want to change the background while the game is running so I can adapt the visuals without restarting.

**Why this priority**: Improves usability without changing game rules and should not require a restart.

**Independent Test**: Can be tested by switching the background mid-session and confirming the background changes while play continues.

**Acceptance Scenarios**:

1. **Given** a game session is in progress, **When** the player switches backgrounds, **Then** the new background is shown without interrupting play.

---

### User Story 3 - Keep my preferred background (Priority: P3)

As a returning player, I want the game to remember my last chosen background so I do not need to set it every time.

**Why this priority**: Convenience for repeat play, but not required for initial use.

**Independent Test**: Can be tested by selecting a background, returning later, and confirming the same background is preselected.

**Acceptance Scenarios**:

1. **Given** the player previously selected a background, **When** they return to the game, **Then** that background is preselected and displayed.

---

### Edge Cases

- What happens when a background option is unavailable? The game falls back to the default background and indicates the fallback.
- How does the system handle rapid toggling between backgrounds? The latest selection is the one displayed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST offer exactly two background choices: kommun and danger.
- **FR-002**: The player MUST be able to change the background from the game interface without reloading the page.
- **FR-003**: The selected background MUST be displayed immediately after selection.
- **FR-004**: The game MUST remember the last selected background for the same player on the same device.
- **FR-005**: The game MUST default to the kommun background when no preference exists or a stored preference is invalid.
- **FR-006**: The background change MUST NOT alter gameplay rules, scoring, or session timing.
- **FR-007**: The game MUST surface a clear indicator of which background is currently active.
- **FR-008**: The background change MUST be triggered by pressing the B key and MUST NOT require an on-screen control.

### Key Entities *(include if feature involves data)*

- **Background Preference**: The player's last selected background option and when it was last updated.

## Assumptions

- The game can accept keyboard input during play without conflicting with core controls.
- The background preference is specific to the player on the same device.
- Only the two named backgrounds are in scope for this feature.

## Dependencies

- The kommun and danger background assets are available and approved for use in-game.
- The in-game HUD can show a small indicator for the active background without obscuring core gameplay information.

## Clarifications

### Session 2026-01-15

- Q: Which single key should toggle the background? → A: B key

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A player can switch between backgrounds within 30 seconds of opening the game without external help.
- **SC-002**: The selected background becomes visible within 1 second of a selection.
- **SC-003**: At least 90% of test users can identify the active background after switching.
- **SC-004**: The last selected background is shown on return visits for at least 95% of repeat sessions on the same device.
