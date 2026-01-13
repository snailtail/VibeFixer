# Research Findings: Second Vibe Coder + Toast

## Decision 1: Add a second coder instead of speeding up the first

- **Decision**: Keep the original coder speed constant and introduce a second coder at 30 seconds.
- **Rationale**: Preserves the original pacing while clearly signaling a mid-round difficulty bump.
- **Alternatives considered**:
  - Increasing the original coder speed (less readable change for players).
  - Reducing drop interval only (less visual impact).

## Decision 2: Non-blocking toast overlay

- **Decision**: Show a brief toast message shortly before the second coder appears without pausing gameplay.
- **Rationale**: Warns the player without interrupting input or movement.
- **Alternatives considered**:
  - Full-screen modal (too disruptive).
  - No warning (less fair to players).
