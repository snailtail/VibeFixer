# Feature Specification: Stun vibe coder on hit

**Feature Branch**: `024-stun-vibe-coder-hit`
**Created**: 2026-01-14
**Status**: Draft
**Input**: User description: "Stun vibe coder on hit"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Stun a coder with a carried artifact (Priority: P1)

As a player carrying a code artifact, I want to jump and hit a vibe coder to stun them for 10 seconds so I can create a brief window of safety.

**Why this priority**: This is the core gameplay mechanic being added.

**Independent Test**: Carry an artifact, collide with a coder, and confirm the coder stops moving/dropping and flickers for 10 seconds, then resumes.

**Acceptance Scenarios**:

1. **Given** a player carrying an artifact, **When** the player collides with a vibe coder, **Then** that coder is stunned for 10 seconds, stops moving, and stops dropping artifacts.
2. **Given** a stunned coder, **When** 10 seconds elapse, **Then** the coder resumes movement and dropping behavior.
3. **Given** a stun event, **When** the coder is stunned or recovers, **Then** the Game Events log displays appropriate messages for both transitions.

---

### Edge Cases

- What happens if the player collides again with an already stunned coder? The stun should refresh or be ignored (define in plan).
- What happens if two coders exist? Only the collided coder is stunned.
- What if the player is not carrying an artifact? No stun occurs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Carrying a code artifact MUST allow the player to stun a single collided vibe coder.
- **FR-002**: A stunned coder MUST stop moving and stop dropping artifacts for 10 seconds.
- **FR-003**: The stunned coder MUST have a flicker visual cue while stunned.
- **FR-004**: The Game Events log MUST record both the stun and recovery events.

### Key Entities *(include if feature involves data)*

- **VibeCoder**: Enemy entity with position, movement, and drop behavior; gains temporary stun state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A player can reliably stun a coder for 10 seconds by colliding while carrying an artifact.
- **SC-002**: Coder movement and drop logic suspend during stun and resume afterward.
- **SC-003**: The flicker effect is visible for the entire stun duration.
