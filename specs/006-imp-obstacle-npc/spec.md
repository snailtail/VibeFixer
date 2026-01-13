# Feature Specification: Imp Ediment Obstacles

**Feature Branch**: `006-imp-obstacle-npc`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "Next feature is a new NPC character in the game. Imp Ediment is an imp that runs around randomly placing obstacle blocks on the map - never lower than 1 player height above the ground, and never in collision with the player, the trash can, or an artifact. The Imp Ediment appears at least 1 time during the game - after 10 to 20 seconds. Randomly the imp may appear also one more time after 40 seconds and place more blocks. When this happens a toaster message displays \"Oh no Imp Ediment is out and about placing obstacles, look out!\" Imp Ediment teleports from location to location so he does not run or move, he just appears wherever there needs to be an obstacle placed. He will place from 1 to 5 obstacle blocks each time he appears. It would be preferrable that he is very quick, placing the obstacles within maximum 2 seconds. He has his own sprite \"frontend/src/assets/imp_ediment.png\" there is a \"whooshing sound\" heard each time he appears."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Imp appearance and obstacle placement (Priority: P1)

As a player, I want Imp Ediment to appear mid-round and quickly place new obstacles so the level changes dynamically.

**Why this priority**: This is the core behavior that adds surprise and difficulty.

**Independent Test**: Can be tested by running a round past the first appearance window and confirming 1-5 new obstacles appear within 2 seconds.

**Acceptance Scenarios**:

1. **Given** a round has run for 10 to 20 seconds, **When** Imp Ediment appears, **Then** it places 1 to 5 new obstacles within 2 seconds.
2. **Given** Imp Ediment places obstacles, **When** each obstacle is created, **Then** it does not overlap the player, trash can, or any artifact.

---

### User Story 2 - Optional second appearance (Priority: P2)

As a player, I want a possible second Imp Ediment appearance later in the round so difficulty can spike unexpectedly.

**Why this priority**: A second appearance increases variability without guaranteed repetition.

**Independent Test**: Can be tested by running multiple rounds and observing that the second appearance happens sometimes after 40 seconds.

**Acceptance Scenarios**:

1. **Given** a round passes 40 seconds, **When** the second appearance occurs, **Then** a toast message displays: "Oh no Imp Ediment is out and about placing obstacles, look out!"
2. **Given** the second appearance occurs, **When** Imp Ediment places obstacles, **Then** it follows the same placement rules and timing as the first appearance.

---

### User Story 3 - Teleporting NPC feedback (Priority: P3)

As a player, I want clear feedback when Imp Ediment appears so I notice the new threat.

**Why this priority**: The whooshing sound and visible sprite signal the event without pausing play.

**Independent Test**: Can be tested by observing the sprite and audio whenever Imp Ediment appears.

**Acceptance Scenarios**:

1. **Given** Imp Ediment appears, **When** it teleports to place an obstacle, **Then** the imp sprite is visible at the placement location.
2. **Given** Imp Ediment appears, **When** it teleports, **Then** a short whooshing sound plays.

---

### Edge Cases

- What happens if no valid placement spot exists? (Imp skips that placement and tries another location.)
- What happens if the player is directly under the target spot? (Imp chooses a different location.)
- What happens if Imp Ediment appears near the end of the round? (It still performs its placement quickly.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Imp Ediment MUST appear at least once between 10 and 20 seconds into the round.
- **FR-002**: Imp Ediment MUST place between 1 and 5 obstacle blocks per appearance.
- **FR-003**: Each placement event MUST complete within 2 seconds of the imp appearance.
- **FR-004**: New obstacles MUST be positioned at least one player height above the ground level.
- **FR-005**: New obstacles MUST NOT overlap the player, trash can, artifacts, or existing obstacles.
- **FR-006**: Imp Ediment MUST teleport to placement locations (no walking or pathing).
- **FR-007**: A whooshing sound MUST play each time Imp Ediment appears.
- **FR-008**: The second appearance MAY occur after 40 seconds and MUST reuse the same placement rules when it happens.
- **FR-009**: When the second appearance occurs, the toast message MUST display: "Oh no Imp Ediment is out and about placing obstacles, look out!"

### Key Entities *(include if feature involves data)*

- **Imp Ediment**: Teleporting NPC that places new obstacle blocks.
- **Placement Rule Set**: The constraints governing where obstacles can be placed.
- **Appearance Window**: The time windows that control when Imp Ediment may appear.

### Assumptions

- The second appearance has a 50% chance of occurring within a small window after 40 seconds.
- Imp Ediment uses the existing obstacle block sprite style.
- The whooshing sound will be a short CC0-licensed audio asset similar in tone to existing effects.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 10 rounds, Imp Ediment appears at least once in every round between 10 and 20 seconds.
- **SC-002**: When Imp Ediment appears, all placed obstacles follow placement rules with zero overlaps.
- **SC-003**: Each appearance completes placements within 2 seconds.
- **SC-004**: In at least 4 out of 10 rounds, a second appearance occurs after 40 seconds.
- **SC-005**: The whooshing sound plays on every appearance and the toast appears on the second appearance.
