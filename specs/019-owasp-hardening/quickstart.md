# Quickstart: OWASP Hardening (Remaining Items)

## Local Verification

1. Start backend and frontend as usual.
2. Confirm `/api/system/stats` returns the new fields.
3. Trigger a validation error repeatedly to confirm the alert threshold logs after 10 events per minute.
4. Simulate a schema version mismatch and confirm startup fails safely with a clear log.

## Regression Checks

- Start a session and confirm gameplay unaffected.
- Submit a high score and confirm validation still works.
- Verify production error responses remain generic.
