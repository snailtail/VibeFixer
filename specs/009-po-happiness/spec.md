# Feature Specification: PO Happiness Status

**Feature Branch**: `009-po-happiness`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "Product Owner happiness: The amount of blockers left on the game map should impact the happiness of the character ""Product owner"". The product owner is an ASCII art figure placed to the left of the game area in the ""PO STATUS"" window below the log The PO has three moods: Happy, Content, Sad Decide which amounts of obstacles that make the PO sad, and content. The only way to make him happy is to have 0 obstacles left. Generate three different ASCII art faces for a 30 year old man with a great beard and pretty long hair, one which shows him as happy, one for content, and one for sad."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - PO mood reflects blockers (Priority: P1)

As a player, I want the PO status to reflect the number of blockers left so I can see how well the map is being managed.

**Why this priority**: The PO status is the core visual feedback for this feature.

**Independent Test**: Can be tested by forcing different blocker counts and confirming the PO mood changes correctly.

**Acceptance Scenarios**:

1. **Given** there are 0 blockers remaining, **When** the PO status updates, **Then** the PO is Happy.
2. **Given** there are 1 to 3 blockers remaining, **When** the PO status updates, **Then** the PO is Content.
3. **Given** there are 4 or more blockers remaining, **When** the PO status updates, **Then** the PO is Sad.

---

### User Story 2 - PO image display (Priority: P2)

As a player, I want to see the PO image in the PO STATUS panel so the mood is readable at a glance.

**Why this priority**: The mood must be visible and readable during gameplay.

**Independent Test**: Can be tested by loading the game and confirming the PO image changes when the blocker count changes.

**Acceptance Scenarios**:

1. **Given** the PO STATUS panel is visible, **When** the PO mood is Happy, **Then** the happy PO image is shown.
2. **Given** the PO STATUS panel is visible, **When** the PO mood is Content, **Then** the content PO image is shown.
3. **Given** the PO STATUS panel is visible, **When** the PO mood is Sad, **Then** the sad PO image is shown.

---

### User Story 3 - Consistent layout (Priority: P3)

As a player, I want the PO STATUS panel to stay in place so the left-side layout remains stable.

**Why this priority**: Stable layout avoids distracting UI shifts during play.

**Independent Test**: Can be tested by running the game and confirming the PO STATUS panel remains below the log.

**Acceptance Scenarios**:

1. **Given** the game is running, **When** blocker counts change, **Then** the PO STATUS panel remains below the log without resizing the game area.

---

### Edge Cases

- What happens if the blocker count spikes rapidly? (PO mood should update to the correct state without flicker.)
- What happens when there are no blockers at game start? (PO should immediately be Happy.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The PO mood MUST be derived from the current blocker count.
- **FR-002**: The PO mood MUST be Happy when blocker count is 0.
- **FR-003**: The PO mood MUST be Content when blocker count is 1 to 3.
- **FR-004**: The PO mood MUST be Sad when blocker count is 4 or more.
- **FR-005**: The PO STATUS panel MUST display an image for each mood.
- **FR-006**: The images MUST depict a 30-year-old man with a great beard and long hair.
- **FR-007**: The PO STATUS panel MUST remain below the event log panel on the left side of the game area.
- **FR-008**: The PO images MUST be sourced from `frontend/src/assets/po_happy.png`, `frontend/src/assets/po_content.png`, and `frontend/src/assets/po_sad.png`.

### Key Entities *(include if feature involves data)*

- **PO Mood**: The derived state (Happy, Content, Sad) based on blocker count.
- **PO Images**: Three mood-specific images shown in the PO STATUS panel.
- **Blocker Count Thresholds**: Values that map blockers to moods.

### Assumptions

- Blocker count refers to obstacles only, not unchecked code artifacts.
- The PO STATUS panel already exists under the event log and can render scaled images.
- The PO images are owned by the project owner and available under CC0.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: PO mood updates within 1 second of a blocker count change.
- **SC-002**: Each blocker threshold (0, 1-3, 4+) consistently maps to the correct mood across 100% of checks.
- **SC-003**: PO images render legibly in the PO STATUS panel at default zoom levels.
- **SC-004**: The PO STATUS panel remains fixed below the log in all screen sizes supported by the game.
