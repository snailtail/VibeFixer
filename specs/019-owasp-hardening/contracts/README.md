# Contracts

No new external API endpoints are introduced in this feature.

Existing endpoints impacted by security hardening:
- `GET /api/system/stats` (expanded system fields)
- `GET /api/sessions/stats` (existing)
- `POST /api/sessions/*` and `POST /api/high-scores` (existing validation, rate limits)
