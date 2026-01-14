# API Contract Notes

No new endpoints are introduced. The following contract behaviors apply to existing endpoints:

- **All responses** include baseline security headers.
- **Write endpoints** (POST to sessions, artifact updates, high scores) enforce rate limiting at 60 req/min/IP.
- **Validation failures** return safe JSON errors without stack traces.
- **Rate-limit exceeded** returns a safe JSON error with a 429 status.

Endpoints affected:
- `POST /api/sessions`
- `POST /api/sessions/{id}/deposit`
- `POST /api/sessions/{id}/spawn`
- `POST /api/sessions/{id}/artifact-status`
- `POST /api/sessions/{id}/end`
- `POST /api/high-scores`
