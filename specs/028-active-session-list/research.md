# Research: Active Session List

## Decision 1: Admin endpoint for active sessions

**Decision**: Provide a dedicated admin endpoint for active sessions at `/api/admin/sessions/active`.
**Rationale**: Aligns with existing admin-only routes and keeps access controlled via admin session checks.
**Alternatives considered**:
- Reuse the public session stats endpoint and extend it with a detailed list (rejected: mixes public stats with admin-only data).
- Add a client-side-only list without a dedicated endpoint (rejected: requires exposing data in other responses).

## Decision 2: Data source and fields

**Decision**: Build the list from the live session store and derive summary fields (identifier, status, start time, elapsed duration, score, remaining artifacts, player speed modifier).
**Rationale**: The session store is the source of truth for active sessions and already tracks these values during play.
**Alternatives considered**:
- Query the persistent session database for active sessions (rejected: may lag real-time state and adds unnecessary IO).

## Decision 3: Refresh cadence

**Decision**: Refresh the list on a fixed interval (<= 4 seconds).
**Rationale**: Meets the requirement for timely updates without introducing push mechanisms.
**Alternatives considered**:
- Real-time streaming updates (rejected: unnecessary complexity for admin monitoring needs).
