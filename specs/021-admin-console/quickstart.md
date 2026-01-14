# Quickstart: Admin Console Upgrade

## Local Verification

1. Start the backend and frontend.
2. Log in at `/admin/login` and confirm session cookie persists for 30 minutes.
3. Navigate between `/admin/logs`, `/admin/high-scores`, `/admin/notices`, and `/admin/game-settings` without re-login.
4. Create a notice and confirm it shows on `/` with the basement troll title.
5. Edit and delete a high score entry and confirm changes persist.
6. Set player speed to 120% and confirm the next game session uses the new speed.

## Regression Checks

- Existing gameplay endpoints continue to work.
- Admin endpoints reject requests when session expired.
