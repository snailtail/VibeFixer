# Feature Specification: C-key allergy easter egg

**Feature Branch**: `026-c-key-allergy`
**Created**: 2026-01-14
**Status**: Draft
**Input**: User description: "C key allergy easter egg"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Trigger C-key allergy debuff (Priority: P1)

As a player, I want a hidden double-tap C key easter egg that slows vibe coders for the rest of the game.

**Why this priority**: This is the core mechanic and the reason for the feature.

**Independent Test**: During gameplay, double-tap C within 1 second and verify all active coders slow by 40% for the remainder of the session, with a toast and log entry.

**Acceptance Scenarios**:

1. **Given** a running game with active vibe coders, **When** the player presses C twice within 1 second, **Then** all active coders reduce speed by 40% for the rest of the game.
2. **Given** the easter egg triggers, **When** it fires, **Then** a toast appears with the provided long message and a concise log entry is added.
3. **Given** the easter egg, **When** the controls or instructions render, **Then** the C-key behavior is not documented.

---

### Edge Cases

- If no coder is active yet, the debuff should apply once they appear (define in plan).
- The debuff should trigger only once per session.
- If the player presses C twice outside the window, no effect.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Double-tapping C within 1 second MUST trigger the allergy debuff once per game session.
- **FR-002**: All active vibe coders MUST have speed reduced by 40% for the rest of the game.
- **FR-003**: The debuff MUST apply to coders that appear after the trigger.
- **FR-004**: A toast MUST display: "Oh no, you used C, the vibe coders are allergic to C, they will surely not perform as fast now..."
- **FR-005**: The Game Events log MUST record a concise message about the C allergy trigger.
- **FR-006**: The C-key behavior MUST remain undocumented in instructions or controls.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Double-tapping C consistently slows coders and shows the toast/log.
- **SC-002**: The debuff persists for the session and applies to future coders.
