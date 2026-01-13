# Feature Specification: Second Vibe Coder + Toast

**Feature Branch**: `003-add-second-villain`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "New feature number 003 (if thats not already used - check please): Instead of having the speed of the villain increase after 15 seconds. lets add a second villain after 30 seconds. keep the initial speed for the villan number 1, and let villain number 2 have the same speed also. but this effectively doubles the amount of code \"dropping\" after half the sprint. also, right before adding the second villain i want a message to flash on the game screen without disrupting the game play - the user should still be able to play while reading this \"toaster\" message saying: \"Uh oh, the customer has hired another vibe coder. Lets try to keep"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Handle the second vibe coder (Priority: P1)

As a player, I want a second vibe coder to join mid‑round so the challenge ramps up by doubling the drop rate.

**Why this priority**: The new coder is the core feature and directly changes difficulty.

**Independent Test**: Can be tested by running a round past 30 seconds and observing a second coder that drops artifacts at the same base speed as the first.

**Acceptance Scenarios**:

1. **Given** a round has reached 30 seconds elapsed, **When** the timer crosses the threshold, **Then** a second vibe coder appears and begins dropping artifacts.
2. **Given** two vibe coders are active, **When** both are dropping artifacts, **Then** the overall drop rate is roughly doubled compared to the first 30 seconds.

---

### User Story 2 - See a mid‑round toast (Priority: P2)

As a player, I want a short on‑screen toast warning before the second coder appears so I can prepare.

**Why this priority**: The toast provides fair notice without interrupting play.

**Independent Test**: Can be tested by running a round and confirming a non‑blocking toast appears shortly before 30 seconds.

**Acceptance Scenarios**:

1. **Given** the round is approaching 30 seconds elapsed, **When** the warning moment is reached, **Then** a toast appears without pausing gameplay.

---

### User Story 3 - Keep base coder speed unchanged (Priority: P3)

As a player, I want the original coder to keep its initial speed so the difficulty increase comes from adding a second coder, not faster movement.

**Why this priority**: The new behavior should replace speed increases with a second coder.

**Independent Test**: Can be tested by comparing the coder speed before and after 30 seconds and confirming it does not change.

**Acceptance Scenarios**:

1. **Given** a round in progress, **When** time passes beyond 30 seconds, **Then** coder movement and drop cadence remain at the original rate.

---

### Edge Cases

- What happens if the second coder spawns on top of the first coder?
- How does the toast behave if the player is already in a game over state?
- What happens if the round ends before the second coder appears?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST keep the original coder speed and drop cadence unchanged throughout the round.
- **FR-002**: The system MUST introduce a second coder at 30 seconds elapsed.
- **FR-003**: The second coder MUST move and drop artifacts at the same base speed as the first coder.
- **FR-004**: The second coder MUST start moving in the opposite direction of the first coder at spawn time.
- **FR-005**: The system MUST display a non‑blocking toast shortly before 30 seconds with the message: “Uh oh, the customer has hired another vibe coder. Let’s try to keep up!”
- **FR-006**: The toast MUST not pause gameplay or block inputs.

### Key Entities *(include if feature involves data)*

- **Vibe Coder**: A dropper that moves along the top floor and spawns artifacts.
- **Toast Message**: A timed, non‑blocking on‑screen warning.

### Assumptions

- The second coder appears once per round and persists until the round ends.
- The toast appears a few seconds before the second coder spawns.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In test runs, a second coder appears at 30 seconds ±1 second.
- **SC-002**: In test runs, the combined drop rate after 30 seconds is approximately double the rate before 30 seconds.
- **SC-003**: The toast appears without interrupting player movement or actions.
- **SC-004**: Players report the toast is visible and understandable while gameplay continues.
