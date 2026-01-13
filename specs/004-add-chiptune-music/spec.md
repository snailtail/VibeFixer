# Feature Specification: Chiptune Background Music

**Feature Branch**: `004-add-chiptune-music`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "New user story 004, we want sound for the game. Some simple background music ala"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hear background music (Priority: P1)

As a player, I want simple 8‑bit background music so the game feels more lively and nostalgic.

**Why this priority**: Audio is the core value of this feature and directly impacts player experience.

**Independent Test**: Can be tested by starting the game and confirming background music plays at a comfortable volume.

**Acceptance Scenarios**:

1. **Given** a new game is started, **When** gameplay begins, **Then** background music plays continuously.
2. **Given** the game is running, **When** the track ends, **Then** it loops seamlessly.

---

### User Story 2 - Control music playback (Priority: P2)

As a player, I want to mute or unmute the background music with a keyboard shortcut so I can play quietly if needed.

**Why this priority**: Players often need quick control over audio without leaving the game.

**Independent Test**: Can be tested by pressing the mute key during play, refreshing, and confirming the setting persists.

**Acceptance Scenarios**:

1. **Given** background music is playing, **When** the player presses the “M” key, **Then** the music stops.
2. **Given** music is muted, **When** the player presses the “M” key again, **Then** the music resumes.
3. **Given** the player muted music in a prior session, **When** the page reloads, **Then** music remains muted by default.

---

### User Story 3 - Hear gameplay sound effects (Priority: P3)

As a player, I want short 8‑bit sound effects for key actions so the game feels more responsive.

**Why this priority**: Sound effects reinforce feedback without changing gameplay rules.

**Independent Test**: Can be tested by triggering each action and confirming the expected sound plays.

**Acceptance Scenarios**:

1. **Given** a villain drops new unchecked code, **When** it spawns, **Then** a drop sound plays.
2. **Given** the player jumps, **When** the jump begins, **Then** a jump sound plays.
3. **Given** the player drops unchecked code outside the bin, **When** it lands, **Then** the drop sound plays.
4. **Given** the player deposits unchecked code into the bin, **When** it is accepted, **Then** a distinct success sound plays.
5. **Given** 10 seconds remain, **When** the countdown begins, **Then** a short ticking sound plays once per second.
6. **Given** the second villain warning appears, **When** the toast shows, **Then** a short ominous sound plays.
7. **Given** the game ends, **When** the timer hits zero, **Then** a short game-over sound plays.
8. **Given** the player breaks an obstacle from below, **When** the block shatters, **Then** a short break sound plays.

---

### User Story 4 - Use a CC0 licensed track (Priority: P4)

As a project owner, I want the music to use a CC0 public-domain dedication so we can distribute the game without licensing friction.

**Why this priority**: Licensing must be clear to avoid future legal issues.

**Independent Test**: Can be tested by verifying the audio file and CC0 license text are included in the repository.

**Acceptance Scenarios**:

1. **Given** the repository assets, **When** reviewing the music file, **Then** CC0 license documentation is included alongside it.
2. **Given** the repository root, **When** reviewing project licensing, **Then** the repository uses CC0 licensing.

---

### Edge Cases

- What happens if the browser blocks autoplay audio?
- What happens if the music file fails to load?
- How does the game behave when the tab loses focus?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST include 8‑bit chiptune background music.
- **FR-002**: The music MUST start when gameplay begins.
- **FR-003**: The music MUST loop continuously while the game is running.
- **FR-004**: The player MUST be able to toggle mute/unmute using the “M” key during gameplay.
- **FR-005**: The mute setting MUST persist across page reloads.
- **FR-006**: Muting MUST silence all game audio (music and sound effects).
- **FR-007**: The game MUST play a short drop sound when new unchecked code appears.
- **FR-008**: The game MUST play a short jump sound when the player jumps.
- **FR-009**: The game MUST play a distinct sound when unchecked code is deposited into the bin.
- **FR-010**: The game MUST play a short ticking sound once per second during the final 10 seconds.
- **FR-011**: The game MUST play a short ominous warning sound when the second villain toast appears.
- **FR-012**: The game MUST play a short game-over sound when the timer ends.
- **FR-013**: The game MUST play a short break sound when an obstacle block is destroyed.
- **FR-014**: The music MUST use a CC0 public-domain dedication.
- **FR-015**: The license text or attribution MUST be stored in the repository alongside the music file.
- **FR-016**: The repository MUST include a CC0 license file.

### Key Entities *(include if feature involves data)*

- **Music Track**: The background audio file used during gameplay.
- **Audio Settings**: The mute/unmute state for background music (persisted between sessions).

### Assumptions

- The background music is a single looping track.
- Default volume is comfortable for most players.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of game starts trigger background music playback when autoplay is permitted and mute is not enabled.
- **SC-002**: Music loops without an audible gap in normal playback.
- **SC-003**: Mute/unmute toggles take effect within 1 second and persist across reloads.
- **SC-004**: Each sound effect plays within 1 second of its triggering action and respects mute state.
- **SC-005**: The countdown tick plays for each of the last 10 seconds and the warning sound plays once with the toast.
- **SC-006**: The game-over sound plays when the timer hits zero.
- **SC-007**: The break sound plays when a block is destroyed.
- **SC-008**: CC0 license/attribution files are present for the selected track and repository.
