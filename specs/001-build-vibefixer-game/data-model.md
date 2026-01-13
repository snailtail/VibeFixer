# Data Model: VibeFixer Platformer

## GameSession

- **Fields**: id, seed, startedAt, durationSeconds (default 120), score, status (active/ended), remainingArtifactCount
- **Relationships**: has many Artifacts, has many TerrainSegments, has one TrashCan, has one Character
- **Validation**: durationSeconds must be 120 by default; score must be non-negative; status must be active or ended

## Character (The Fixer)

- **Fields**: id, positionX, positionY, velocityX, velocityY, isJumping, carryingArtifactId (nullable)
- **Relationships**: belongs to GameSession; may reference one Artifact as carried
- **Validation**: carryingArtifactId must be null or reference an existing Artifact in the session

## Artifact

- **Fields**: id, value (1-15), positionX, positionY, status (ground/carried/deposited)
- **Relationships**: belongs to GameSession
- **Validation**: value must be between 1 and 15; status must be one of ground/carried/deposited

## TerrainSegment

- **Fields**: id, type (stone/earth/grass), bounds (x,y,width,height)
- **Relationships**: belongs to GameSession
- **Validation**: bounds must be within level boundaries; type must be one of the allowed materials

## TrashCan

- **Fields**: id, positionX, positionY, bounds (x,y,width,height)
- **Relationships**: belongs to GameSession
- **Validation**: placed at far right boundary; bounds must be within level boundaries

## Player

- **Fields**: id (anonymous), displayName (optional)
- **Relationships**: starts GameSessions
- **Validation**: no persistence required for initial release
