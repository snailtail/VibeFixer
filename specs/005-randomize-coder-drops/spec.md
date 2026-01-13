# Feature Specification: Randomized Coder Drops

**Feature Branch**: `005-randomize-coder-drops`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "Next we need to up the game on difficulty and randomness. The vibe coders need to spawn in different x locations randomly, and they need to dispense new artifacts at random intervals/places, otherwise the drops always fall on the same place and the game gets too predictable."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unpredictable coder spawns (Priority: P1)

As a player, I want the vibe coders to start in different horizontal positions each round so the challenge feels fresh.

**Why this priority**: Spawn variation is the biggest source of immediate replayability.

**Independent Test**: Can be tested by starting multiple new rounds and confirming coder spawn positions differ across runs.

**Acceptance Scenarios**:

1. **Given** a new round starts, **When** the first vibe coder appears, **Then** their starting X position differs from the previous round.
2. **Given** a new round starts, **When** the first coder begins moving, **Then** its initial direction is randomized (left or right).
3. **Given** a second coder appears mid-round, **When** it spawns, **Then** its starting X position is not the same as the first coder’s current position.
4. **Given** a round in progress, **When** the second coder appears, **Then** the spawn time varies within a small random window.

---

### User Story 2 - Variable coder speed (Priority: P2)

As a player, I want vibe coders to change speed during the round so their movement and drops feel less predictable.

**Why this priority**: Speed variation creates less predictable drop locations without changing the core drop cadence.

**Independent Test**: Can be tested by observing a coder’s movement and confirming speed changes occur during a round.

**Acceptance Scenarios**:

1. **Given** a round in progress, **When** time passes, **Then** each coder changes speed at least once.
2. **Given** a round in progress, **When** a coder changes speed, **Then** movement remains within the playable X range.

---

### User Story 3 - Drops follow coder position (Priority: P3)

As a player, I want artifacts to drop from wherever the coder currently stands so movement changes the drop locations.

**Why this priority**: Coder movement directly drives spatial variety in drop locations.

**Independent Test**: Can be tested by observing drops over time and confirming they align with coder positions.

**Acceptance Scenarios**:

1. **Given** a round in progress, **When** a coder drops an artifact, **Then** the drop X matches the coder’s current X position.
2. **Given** a round in progress, **When** the coder moves, **Then** subsequent drops occur at different X positions.

---

### Edge Cases

- What happens if a randomized spawn would place a coder outside the playable X range? (Should clamp to a valid range.)
- What happens if randomization selects overlapping coder positions? (Should separate them.)
- What happens if randomization would place a drop outside the level bounds? (Should use a valid X.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST randomize the starting X position of each vibe coder at the beginning of a round.
- **FR-002**: The randomized spawn X positions MUST be within the playable X range.
- **FR-003**: The first coder’s initial direction MUST be randomized.
- **FR-004**: The second coder’s spawn X MUST NOT overlap the first coder’s current X position.
- **FR-005**: The second coder’s spawn time MUST vary within a bounded random window around the nominal time.
- **FR-006**: Each coder’s movement speed MUST vary during the round within a bounded range.
- **FR-007**: Speed changes MUST keep coders within the playable X range.
- **FR-008**: Artifact drops MUST occur at the coder’s current X position.
- **FR-009**: Randomization MUST still allow all drops to land on reachable surfaces.

### Key Entities *(include if feature involves data)*

- **Vibe Coder**: An enemy that moves along the top floor and drops artifacts.
- **Drop Schedule**: The variable timing and X-position rules governing artifact drops.

### Assumptions

- Randomized timing uses a reasonable min/max window (e.g., a few seconds) that keeps gameplay fair.
- Randomized X positions are limited to the visible level width.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 10 consecutive new rounds, at least 8 spawn positions differ from the immediately previous round.
- **SC-002**: In a 60-second round, each coder changes speed at least once.
- **SC-003**: In a 60-second round, at least 5 distinct drop X positions are observed.
- **SC-004**: No drops occur outside the playable X range.
