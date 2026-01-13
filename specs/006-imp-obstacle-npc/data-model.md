# Data Model: Imp Ediment Obstacles

## Entities

### Imp Ediment

- **Purpose**: Teleporting NPC that places obstacle blocks.
- **Key attributes**: appearanceTime, optionalSecondAppearanceTime, placementsRemaining, lastTeleportPosition.

### Obstacle Placement

- **Purpose**: Defines where a new obstacle block can be spawned.
- **Key attributes**: position (x, y), width, height, constraints (no overlap with player, trash, artifacts, or obstacles).
