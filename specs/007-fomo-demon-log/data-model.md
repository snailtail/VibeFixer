# Data Model: FOMO Demon, Cast, and Event Log

## Entities

### FOMO Demon

- **Purpose**: End-state NPC with defeated or enraged outcomes.
- **Key attributes**: state (defeated/enraged), sprite, endMessage, endSound.

### Blocker Count

- **Purpose**: Secondary score tracking obstacles in the level.
- **Key attributes**: count, lastUpdatedAt.

### Event Log Entry

- **Purpose**: Record notable game events for display.
- **Key attributes**: timestamp, message, type.

### Cast Entry

- **Purpose**: Character bios displayed below the game area.
- **Key attributes**: name, sprite, bio.

### Credits Entry

- **Purpose**: Attribution for sourced assets and co-authors.
- **Key attributes**: label, source.
