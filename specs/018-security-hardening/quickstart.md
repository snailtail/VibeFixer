# Quickstart: Security Hardening Checks

## Prerequisites

- Backend running locally (`node backend/src/server.js`).
- Use any HTTP client (curl).

## Verify Security Headers

```bash
curl -I http://localhost:3000/ | rg -i "content-security-policy|x-frame-options|x-content-type-options|referrer-policy"
```

## Verify Rate Limiting (write endpoint)

```bash
for i in {1..65}; do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/sessions; done
```

Expect `429` responses after the limit is exceeded.

## Verify Validation Errors

```bash
curl -s -X POST http://localhost:3000/api/high-scores -H "Content-Type: application/json" -d '{"playerTag": "", "result": "won"}'
```

Expect a safe JSON error without stack traces.
