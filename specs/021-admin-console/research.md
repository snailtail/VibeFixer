# Phase 0 Research: Admin Console Upgrade

## Decision 1: Admin session cookie
- **Decision**: Use an HTTP-only cookie with a 30-minute expiry for admin sessions.
- **Rationale**: Keeps admin UX smooth across pages without exposing credentials on each request.
- **Alternatives considered**: Token in local storage (rejected for higher risk of accidental exposure).

## Decision 2: Admin page layout
- **Decision**: Use separate admin pages for logs and high scores (e.g., /admin/logs, /admin/high-scores).
- **Rationale**: Clear separation for future settings pages and simpler navigation.
- **Alternatives considered**: Single page with tabs (rejected to keep scope aligned with future settings pages).

## Decision 3: Notice delivery
- **Decision**: Store notices in the database with valid-from/valid-to and serve active notices to the frontend.
- **Rationale**: Ensures consistent messaging across clients and survivable restarts.
- **Alternatives considered**: In-memory notices (rejected due to restart loss).
