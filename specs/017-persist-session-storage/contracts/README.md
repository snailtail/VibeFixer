# Contracts: Persistent Backend Storage

## Summary

No new public API endpoints are required for persistence. Existing endpoints keep the same contract:

- `POST /api/sessions`
- `POST /api/sessions/{id}/end`
- `POST /api/sessions/{id}/deposit`
- `POST /api/sessions/{id}/spawn`
- `POST /api/sessions/{id}/artifact-status`
- `GET /api/sessions/stats`
- `GET /api/system/stats`

Persistence changes are internal to the backend storage layer.
