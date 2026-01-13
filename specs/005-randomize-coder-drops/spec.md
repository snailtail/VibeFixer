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
2. **Given** a second coder appears mid-round, **When** it spawns, **Then** its starting X position is not the same as the first coder’s current position.

---

### User Story 2 - Randomized drop timing (Priority: P2)

As a player, I want artifact drops to happen at varying intervals so I cannot predict the next drop.

**Why this priority**: Variable timing prevents predictable patterns and increases difficulty.

**Independent Test**: Can be tested by observing drop timestamps in a single round and confirming intervals vary.

**Acceptance Scenarios**:

1. **Given** a round in progress, **When** drops occur, **Then** the time between consecutive drops varies within a defined range.
2. **Given** a round in progress, **When** multiple drops happen, **Then** there is no fixed repeating cadence.

---

### User Story 3 - Randomized drop positions (Priority: P3)

As a player, I want artifacts to fall in different horizontal positions so cleanup paths change every round.

**Why this priority**: Spatial variety makes each round feel unique.

**Independent Test**: Can be tested by observing drop locations in one round and confirming multiple distinct X positions.

**Acceptance Scenarios**:

1. **Given** a round in progress, **When** artifacts are dropped, **Then** drops land at multiple distinct X positions within the play area.
2. **Given** consecutive drops, **When** the next artifact spawns, **Then** its X position is not identical to the previous drop.

---

### Edge Cases

- What happens if a randomized spawn would place a coder outside the playable X range? (Should clamp to a valid range.)
- What happens if randomization selects overlapping coder positions? (Should separate them.)
- What happens if randomization would place a drop outside the level bounds? (Should use a valid X.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST randomize the starting X position of each vibe coder at the beginning of a round.
- **FR-002**: The randomized spawn X positions MUST be within the playable X range.
- **FR-003**: The second coder’s spawn X MUST NOT overlap the first coder’s current X position.
- **FR-004**: Artifact drop intervals MUST be randomized within a defined range each round.
- **FR-005**: Artifact drop timing MUST avoid a fixed repeating cadence.
- **FR-006**: Artifact drop X positions MUST be randomized within the playable X range.
- **FR-007**: Consecutive drop X positions MUST NOT be identical.
- **FR-008**: Randomization MUST still allow all drops to land on reachable surfaces.

### Key Entities *(include if feature involves data)*

- **Vibe Coder**: An enemy that moves along the top floor and drops artifacts.
- **Drop Schedule**: The variable timing and X-position rules governing artifact drops.

### Assumptions

- Randomized timing uses a reasonable min/max window (e.g., a few seconds) that keeps gameplay fair.
- Randomized X positions are limited to the visible level width.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 10 consecutive new rounds, at least 8 spawn positions differ from the immediately previous round.
- **SC-002**: In a 60-second round, at least 4 distinct drop intervals are observed.
- **SC-003**: In a 60-second round, at least 5 distinct drop X positions are observed.
- **SC-004**: No drops occur outside the playable X range.
