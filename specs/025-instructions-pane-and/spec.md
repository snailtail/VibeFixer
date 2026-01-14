# Feature Specification: Instructions pane and toast visibility

**Feature Branch**: `025-instructions-pane-and`
**Created**: 2026-01-14
**Status**: Draft
**Input**: User description: "Add instructions pane and improve toasts"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read gameplay instructions (Priority: P1)

As a player, I want a dedicated instructions pane above the story so I can quickly understand how to play and win.

**Why this priority**: New players need clear guidance without cluttering the controls list.

**Independent Test**: Load the game page and verify the instructions pane appears above the story pane with the specified text and styling.

**Acceptance Scenarios**:

1. **Given** the game page, **When** it loads, **Then** an instructions pane appears above the story pane with the provided text.
2. **Given** the controls pane, **When** it renders, **Then** it no longer includes the vibe-coder stun instruction.

---

### User Story 2 - Notice toast visibility (Priority: P2)

As a player, I want critical toast notices to be more visible so I don’t miss important gameplay events.

**Why this priority**: Current toast messages are easy to miss.

**Independent Test**: Trigger the second coder and Imp Ediment toasts and verify the new styling is visually prominent.

**Acceptance Scenarios**:

1. **Given** a toast event, **When** it displays, **Then** it uses updated visual styling that stands out.

---

### Edge Cases

- Instructions pane must fit the same width as the story pane and match its style.
- Toast styling must remain readable on the existing background.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game page MUST include a new instructions pane above the story pane matching the story pane width and style.
- **FR-002**: The instructions pane MUST include the provided instruction text.
- **FR-003**: The controls pane MUST remove the vibe-coder stun instruction line.
- **FR-004**: Toast notifications MUST be more visually prominent than current styling.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can read gameplay instructions without scrolling past the story pane.
- **SC-002**: Toast messages are clearly noticeable during gameplay events.
