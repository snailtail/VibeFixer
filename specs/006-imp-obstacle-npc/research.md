# Research: Imp Ediment Obstacles

## Decision 1: Client-side placement

- **Decision**: Handle Imp Ediment appearances and obstacle placement in the client game loop.
- **Rationale**: Avoids new backend APIs and keeps placements immediate.
- **Alternatives considered**: Server-side placement; rejected to keep scope small.

## Decision 2: Placement search

- **Decision**: Use bounded random attempts per block to find a valid placement location.
- **Rationale**: Satisfies collision rules without stalling gameplay.
- **Alternatives considered**: Deterministic grid placement; rejected for predictability.
