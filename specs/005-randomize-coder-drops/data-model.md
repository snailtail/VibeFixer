# Data Model: Randomized Coder Drops

## Entities

### Vibe Coder

- **Purpose**: Enemy entity that moves along the top floor and drops artifacts.
- **Key attributes**: position (x, y), direction, speed, nextDropAt, nextSpeedChangeAt, initialDirection.

### Drop Schedule

- **Purpose**: Governs when the next artifact drop should occur.
- **Key attributes**: fixedInterval, nextDropAt.

### Spawn Timing

- **Purpose**: Controls when the second coder appears.
- **Key attributes**: secondCoderTime.
