# Feature Specification: FOMO Demon, Cast, and Event Log

**Feature Branch**: `007-fomo-demon-log`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "A big feature request incoming: 1. A new NPC: The FOMO Demon, if there are 0 Unchecked code blocks left on the map when the timer runs out the FOMO Demon is defeated. If there are however code blocks left on the map the FOMO Demon is enraged. If the FOMO Demon Is defeated a happy message is shown at the end of the game. If not, a picture of the angry FOMO Demon is shown, and an angry sound is played. Also a message representing each of these states is shown as part of the Game over message at the end. He has his own sprite \"frontend/src/assets/fomo_demon.png\" 2. Cast and credits: I want a list of the \"cast\" of the game below the game area in the frontend. With a picture (sprite) for the character, and a short bio After that I want a \"credits list\" - listing the resources from where we have sourced content, and also mentioning me as and Codex as co-authors 3. I want to keep track of the amount of blockers (obstacles / blocks) as well as a second game parameter/score. This will not enrage the FOMO demon but it will have impact on the blood pressure of the Product Owner. Then we must also ensure that no blockers are ever placed so low that they cannot be broken by the player. 4. I want a \"log\" on the left side of the game area - showing events, for all events that are mentioned in the toaster messages to begin with. Imp sediment showing up (including stats for what he did) and when the second coder appears as well. Also perhaps a log of when the player deposits artifacts to the trash can, and breaks a block."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - FOMO Demon end-state (Priority: P1)

As a player, I want the FOMO Demon outcome to reflect how clean the map is at game over so the ending feels earned.

**Why this priority**: The FOMO Demon is the headline feature and changes the game ending.

**Independent Test**: Can be tested by finishing a round with zero blocks vs. some blocks and confirming the correct end state, message, and audio.

**Acceptance Scenarios**:

1. **Given** the timer ends with 0 unchecked code blocks on the map, **When** game over triggers, **Then** the FOMO Demon is defeated and a happy message is shown.
2. **Given** the timer ends with 1+ unchecked code blocks on the map, **When** game over triggers, **Then** the FOMO Demon is enraged, an angry image is shown, and an angry sound plays.
3. **Given** game over occurs, **When** the message is displayed, **Then** it includes the FOMO Demon state (defeated or enraged).

---

### User Story 2 - Blocker count and placement safety (Priority: P2)

As a player, I want blocker count tracked and blockers placed at breakable heights so the challenge stays fair.

**Why this priority**: Blocker count adds a new score dimension without making the game unwinnable.

**Independent Test**: Can be tested by observing blocker count and ensuring all blockers can be broken by jumping.

**Acceptance Scenarios**:

1. **Given** obstacles are present, **When** the game is running, **Then** the blocker count updates to reflect current obstacles.
2. **Given** a blocker is placed, **When** the player attempts to break it, **Then** it is always reachable without standing on other blockers.

---

### User Story 3 - Event log (Priority: P3)

As a player, I want a log of key events so I can track what happened during the round.

**Why this priority**: The log provides clarity and narrative for major events.

**Independent Test**: Can be tested by triggering logged events and confirming entries appear in the left-side log.

**Acceptance Scenarios**:

1. **Given** Imp Ediment appears, **When** it places obstacles, **Then** a log entry shows the appearance time and how many blocks were placed.
2. **Given** the second coder appears, **When** the toast appears, **Then** a log entry records the event.
3. **Given** the player deposits an artifact or breaks a block, **When** the action occurs, **Then** a log entry is added.
4. **Given** a vibe coder drops unchecked code, **When** it lands in the world, **Then** a log entry is added.

---

### User Story 4 - Cast and credits (Priority: P4)

As a player, I want cast bios and credits below the game area so the game feels complete and properly attributed.

**Why this priority**: The cast list and credits provide personality and attribution without affecting gameplay.

**Independent Test**: Can be tested by loading the page and confirming the cast and credits appear below the canvas.

**Acceptance Scenarios**:

1. **Given** the game page loads, **When** the player scrolls below the game area, **Then** the cast list shows sprites and short bios.
2. **Given** the cast list is shown, **When** the credits section appears, **Then** it lists sourced resources and credits Magnus and Codex as co-authors.

---

### Edge Cases

- What happens if a blocker count becomes high due to multiple NPC placements? (Count still updates; placements remain breakable.)
- What happens if the FOMO Demon state changes during the last frame? (Final state uses the end-of-round counts.)
- What happens if the log overflows? (Oldest entries drop off, newest remain visible.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST determine FOMO Demon state at timer end based on unchecked code blocks on the map.
- **FR-002**: If unchecked code blocks are 0 at game over, the FOMO Demon MUST be defeated with a happy message.
- **FR-003**: If unchecked code blocks are 1+ at game over, the FOMO Demon MUST be enraged, show the angry sprite, and play an angry sound.
- **FR-004**: The game over message MUST include the FOMO Demon state.
- **FR-005**: The game MUST track and display a blocker count as a second score parameter.
- **FR-006**: Blockers MUST never be placed below a height that the player can reach and break without using other blockers.
- **FR-007**: The left-side event log MUST record toast events (Imp Ediment appearance and second coder appearance).
- **FR-008**: The event log MUST record player actions for artifact deposits and block breaks.
- **FR-009**: The event log MUST record vibe coder code drops.
- **FR-010**: The event log MUST keep the most recent entries visible and discard older entries when full.
- **FR-011**: The cast list MUST appear below the game area with sprites and short bios.
- **FR-012**: The credits list MUST appear below the cast list and include resource sources plus Magnus and Codex as co-authors.
- **FR-013**: The FOMO Demon sprite MUST be used in the end-state display.
- **FR-014**: An angry sound MUST play when the FOMO Demon is enraged.

### Key Entities *(include if feature involves data)*

- **FOMO Demon**: End-state NPC with defeated or enraged outcome.
- **Blocker Count**: Secondary score representing total obstacle blocks.
- **Event Log**: FIFO list of game events displayed beside the game area.
- **Cast Entry**: Character name, sprite, and short bio.
- **Credits Entry**: Resource attribution and co-author credits.

### Assumptions

- Unchecked code blocks correspond to artifacts on the ground at game end.
- The event log displays up to ~8 recent entries.
- Credits can reuse the existing THIRD_PARTY_NOTICES content in summarized form.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Game over consistently shows the correct FOMO Demon state based on remaining unchecked code blocks.
- **SC-002**: Angry sprite and sound play in 100% of enraged endings.
- **SC-003**: Blocker count updates within 1 second of obstacle placement or destruction.
- **SC-004**: All blockers remain breakable without stacking for 100% of placements.
- **SC-005**: The event log shows all toast events and player actions during a round.
- **SC-006**: Cast and credits sections are visible and readable below the game area.
