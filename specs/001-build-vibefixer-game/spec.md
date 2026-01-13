# Feature Specification: VibeFixer Platformer

**Feature Branch**: `001-build-vibefixer-game`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "I want to build a web based game called VibeFixer. It should be a side scrolling platform game, where one player controls the main character called The Fixer using the keyboard (right and left arrows for movement, space for jumping, right shift for picking up artifacts from the ground. The artifacts are pieces of bad code, and they should be put into a trash can at the far right of the level/map. It should be possible to travel right and left and pick up one piece of bad code at a time, right shift picks up a piece of bad code if the fixer is close/adjacent to it, and drops it if the fixer is already holding one. if the fixer is close to the trash can and drops an artifact it should be put into the trash can and increase the score. each artifact is worth different amount of points - ranging from 1 to 15 lines of bad code. the mission in the game is to collect and put as many total lines of bad code in to the trash can as possible before the timer runs out. default time is 2 minutes. the level should have some sort of obstacles like in super mario 3, where the main character needs to jump over and/or run on top of or under them - they can be made of stone/earth/grass. I want to run this web based game on my ubuntu server in the cloud, behind a reverse proxy. it should generate different terrain (obstacles) each time one starts a new game, and also generate between 30 and 50 artifacts (pieces of bad code) as explained before, placed at random places on the level - but all being possible to reach for the main character by jumping or running."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Keep the ground clear (Priority: P1)

As a player, I want to clear bad-code artifacts dropped onto the terrain so that the number of artifacts left on the ground is as low as possible when time runs out.

**Why this priority**: This is the core game loop and primary value of the game.

**Independent Test**: Can be fully tested by starting a round, waiting for drops, picking up an artifact, depositing it, and observing the timer and ground-count score.

**Acceptance Scenarios**:

1. **Given** a new round has started, **When** the player deposits an artifact into the trash can, **Then** the ground-count score decreases accordingly.
2. **Given** the round timer reaches zero, **When** time expires, **Then** the round ends and the final ground-count score is shown.

---

### User Story 2 - Navigate obstacles and terrain (Priority: P2)

As a player, I want to move left/right and jump over or onto obstacles so I can reach artifacts across the level.

**Why this priority**: Movement and obstacle traversal are required to access collectibles and play the game.

**Independent Test**: Can be tested by moving through a level with obstacles and verifying the character can jump, land, and traverse.

**Acceptance Scenarios**:

1. **Given** obstacles in the level, **When** the player jumps or runs, **Then** the character can traverse over, onto, or under obstacles as expected.
2. **Given** multiple tiers of obstacle blocks, **When** the player jumps, **Then** the player can reach and stand on elevated platforms.

---

### User Story 3 - Face randomized drops (Priority: P3)

As a player, I want the vibe coder to drop artifacts from the top of the level during the round so that the challenge evolves over time.

**Why this priority**: Randomization provides replayability and aligns with the requested experience.

**Independent Test**: Can be tested by starting a round and observing timed drops from the top floor during play.

**Acceptance Scenarios**:

1. **Given** a round in progress, **When** the vibe coder moves along the top floor, **Then** artifacts drop at a steady cadence.

---

### User Story 4 - Break obstacle blocks (Priority: P3)

As a player, I want to break some obstacle blocks by jumping into them from below so I can open paths and drop artifacts down.

**Why this priority**: Breakable blocks add tactical movement and keep the level dynamic.

**Independent Test**: Can be tested by jumping into a floating block and confirming it disappears and anything on top falls.

**Acceptance Scenarios**:

1. **Given** a breakable obstacle block, **When** the player hits it from below, **Then** the block is removed from the level.
2. **Given** an artifact resting on a block, **When** that block breaks, **Then** the artifact falls to the next surface or the floor.

---

### Edge Cases

- What happens when the player tries to pick up an artifact while already carrying one? Answer: Nothing happens, the player can only carry one artifact at a time.
- What happens when the player drops an artifact while not adjacent to the trash can? Answer: The artifact drops down onto the terrain and the player is no longer carrying an artifact.
- How does the game handle the timer expiring while the player is carrying an artifact? Answer: A carried artifact is just dropped to the ground/terrain if the timer expires and the game is over.
- What happens if an artifact drops onto a floating obstacle? Answer: The artifact should rest on the obstacle surface and count toward ground clutter.
- What happens if the player breaks a block under another platform? Answer: The block disappears and debris falls without affecting other platforms.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST be a single-player platform experience with a controllable main character named The Fixer.
- **FR-002**: The level MUST be a fixed-size, single-screen arena with no horizontal scrolling.
- **FR-003**: The player MUST be able to move left/right with arrow keys, jump with the up arrow, and use Space to pick up or drop artifacts.
- **FR-004**: The player MUST be able to pick up one artifact at a time when its sprite is within ~15 pixels of the player sprite edge, and drop it using Space.
- **FR-005**: The player MUST be constrained within the level bounds and cannot leave the visible play area.
- **FR-006**: The trash can MUST be placed on the right side of the level and accept artifacts dropped when the player is inside its bounds.
- **FR-007**: The score MUST represent the number of artifacts remaining on the terrain.
- **FR-008**: The round timer MUST default to 60 seconds and end the round when it reaches zero.
- **FR-009**: The game MUST display the remaining time and ground-count score during play.
- **FR-010**: The vibe coder MUST drop artifacts from the top floor during the round at a steady cadence.
- **FR-011**: Dropped artifacts MUST land on terrain or obstacle surfaces.
- **FR-012**: The level MUST include multiple tiers of obstacle blocks that the player can stand on.
- **FR-013**: Obstacles MUST NOT be generated inside the trash can bounds.
- **FR-014**: A non-ground obstacle block MUST be destroyed when the player hits it from below.
- **FR-015**: When a block is destroyed, any artifact resting on top MUST fall to the next surface or the floor.
- **FR-016**: The game MUST function correctly when hosted on a cloud server behind a reverse proxy.

### Key Entities *(include if feature involves data)*

- **Player**: The person playing a round, with controls and a score.
- **Character (The Fixer)**: The in-game avatar controlled by the player, with position and carrying state.
- **Artifact**: A collectible item representing bad code, with a point value and location.
- **Trash Can**: The deposit target for artifacts that converts artifacts into score.
- **Level**: The side-scrolling map containing terrain and obstacles.
- **Obstacle**: A terrain element the character must jump over, onto, or under.
- **Game Session**: A timed round with its own generated terrain, artifact set, timer, and score.

### Assumptions

- The game focuses on a single level per session with no multi-level progression in the first release.
- The keyboard controls are fixed to the keys specified in the request.
- There are no user accounts, saving, or multiplayer features in scope.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can start a new round and control The Fixer within 5 seconds of initiating the game.
- **SC-002**: In test runs, 100% of dropped artifacts land on terrain or obstacle surfaces.
- **SC-003**: In test runs, the ground-count score updates within 1 second after an artifact is deposited.
- **SC-004**: The round consistently ends at the 60-second mark within a 1-second tolerance.
- **SC-005**: At least 90% of playtesters can successfully collect and deposit at least one artifact within a single round.
- **SC-006**: In test runs, at least one obstacle tier is reachable and a block can be broken from below.
