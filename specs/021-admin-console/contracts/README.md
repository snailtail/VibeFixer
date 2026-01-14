# Contracts

Admin API endpoints (planned):

- `POST /api/admin/login` (creates admin session cookie)
- `POST /api/admin/logout` (clears admin session)
- `GET /api/admin/logs` (admin log viewer)
- `GET /api/admin/logs/export`
- `GET /api/admin/high-scores`
- `PATCH /api/admin/high-scores/{id}`
- `DELETE /api/admin/high-scores/{id}`
- `GET /api/admin/notices`
- `POST /api/admin/notices`
- `PATCH /api/admin/notices/{id}`
- `DELETE /api/admin/notices/{id}`
- `GET /api/admin/game-settings`
- `PUT /api/admin/game-settings`

Frontend uses:
- `GET /api/notices/active` for toast messages on `/`
