# Research: Randomized Coder Drops

## Decision 1: Randomize coder spawn X

- **Decision**: Spawn coders at a random X within the playable range, with a small edge buffer.
- **Rationale**: Prevents predictable starting positions while keeping coders visible and reachable.
- **Alternatives considered**: Fixed spawn points; rejected due to repetitive patterns.

## Decision 2: Randomize coder direction and second spawn time

- **Decision**: Randomize the first coder’s initial direction and vary the second coder’s spawn time around the nominal target.
- **Rationale**: Reduces predictability at both the start and midpoint of the round.
- **Alternatives considered**: Fixed direction/time; rejected due to repetitive feel.

## Decision 3: Vary coder speed over time

- **Decision**: Randomize coder movement speed within a bounded range and update it periodically.
- **Rationale**: Creates unpredictable drop locations while keeping the drop cadence stable.
- **Alternatives considered**: Randomizing drop intervals; rejected to keep cadence consistent.

## Decision 4: Drop at coder position

- **Decision**: Spawn artifacts directly at the coder’s current X position.
- **Rationale**: Keeps drops visually tied to the coder while still varying locations as speed changes.
- **Alternatives considered**: Adding random drop offsets; rejected to keep drops consistent with coder position.
