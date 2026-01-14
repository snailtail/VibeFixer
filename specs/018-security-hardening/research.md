# Research Decisions

## Rate Limiting

- **Decision**: Implement in-memory per-IP rate limiting for write endpoints at 60 req/min.
- **Rationale**: Lightweight, no new infrastructure, sufficient for current traffic profile.
- **Alternatives considered**: External reverse-proxy rate limiting; persistent rate-limiting store.

## Security Headers

- **Decision**: Add baseline headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
- **Rationale**: Mitigates common browser threats with minimal risk of breaking the app.
- **Alternatives considered**: No headers; rely on proxy-only headers.

## Input Validation

- **Decision**: Centralize request validation for all JSON bodies (type, length, allowed values).
- **Rationale**: Reduces injection and malformed data risks with consistent behavior.
- **Alternatives considered**: Per-route ad-hoc validation only.

## Observability

- **Decision**: Emit structured JSON logs for security events (rate-limit hits, validation failures, server errors).
- **Rationale**: Supports monitoring and incident investigation without extra tooling.
- **Alternatives considered**: Plain text logs only; no logging.

## Data Retention & Cleanup

- **Decision**: Define retention windows for sessions and high scores; schedule cleanup on interval.
- **Rationale**: Prevents unbounded growth and aligns with security hardening goals.
- **Alternatives considered**: No cleanup; manual cleanup only.

## Dependency Integrity

- **Decision**: Add a lockfile and run `npm audit` in CI for backend dependencies.
- **Rationale**: Improves supply-chain integrity with minimal workflow change.
- **Alternatives considered**: Manual dependency checks only.

## Data Integrity & Versioning

- **Decision**: Maintain a schema version table and document a migration approach.
- **Rationale**: Protects persisted data from incompatible changes.
- **Alternatives considered**: No schema versioning.
