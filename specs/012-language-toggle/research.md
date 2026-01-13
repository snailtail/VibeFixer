# Research: Language Toggle

## Decision: Centralize UI strings in a translation map

**Rationale**: A single source of truth makes it easier to apply language changes consistently.

**Alternatives considered**:
- Inline strings in multiple components (harder to keep consistent)

## Decision: Persist language preference in local storage

**Rationale**: Matches the existing mute preference pattern and avoids backend changes.

**Alternatives considered**:
- Query parameter-based language (not persistent)
- Server-side storage (unnecessary for local UI preferences)
