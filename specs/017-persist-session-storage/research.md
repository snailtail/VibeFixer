# Research: Persistent Backend Storage

## Decision: Use SQLite with a host-mounted database file

**Rationale**: SQLite provides durable storage in a single file, supports concurrent reads/writes, and is lightweight for a small game server. It fits the requirement to persist outside the container without running a separate database service.

**Alternatives considered**:
- Flat JSON file: simpler but risks corruption and lacks concurrency safety.
- External database (PostgreSQL): durable but adds operational complexity beyond current needs.

## Decision: Store database file on a mounted host volume

**Rationale**: A bind-mounted or named Docker volume keeps data durable across container recreation and host reboots.

**Alternatives considered**:
- Container filesystem only: data is lost on redeploy.
- Networked storage: unnecessary complexity for current scale.

## Decision: Use a SQLite driver compatible with Node.js 20 and Alpine

**Rationale**: The backend runs in a `node:20-alpine` container, so the driver must build reliably in that environment and support synchronous or async access safely.

**Alternatives considered**:
- Drivers requiring heavy native build steps or additional system packages.

