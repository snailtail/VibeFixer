# OWASP Top 10:2025 Review TODOs

This file captures follow-up work items after reviewing the OWASP Top 10:2025 list.
Items are grouped by category and intended to be planned and implemented later.

## A01: Broken Access Control

- [x] Define whether any API endpoints require authentication or rate limiting for abuse prevention.
- [x] If public access remains, add per-IP throttling for write endpoints (`/api/sessions/*`, `/api/high-scores`).

## A02: Security Misconfiguration

- [x] Add baseline security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
- [x] Confirm production `NODE_ENV` and disable verbose error output in production.

## A03: Software Supply Chain Failures

- [x] Document dependency update cadence and run `npm audit` in CI.
- [x] Consider lockfile integrity checks in CI.

## A04: Cryptographic Failures

- [X] Ensure TLS termination is enforced in proxy config (Caddy/Cloudflare).
- [ ] Confirm any future sensitive data storage uses encryption at rest.

## A05: Injection

- [x] Add server-side input validation constraints for `playerTag` and high score payloads.
- [x] Centralize validation for all POST bodies (length, type, allowed chars).

## A06: Insecure Design

- [x] Add abuse protection for high score spam (cooldown per client).
- [x] Define data retention and cleanup rules for sessions/high scores.

## A07: Authentication Failures

- [x] Decide if admin or moderation endpoints are needed; if so, implement auth.
- [ ] If admin endpoints are added, add session/token rotation and secure storage.

## A08: Software or Data Integrity Failures

- [x] Add integrity checks for persisted data (schema versioning/migrations).
- [ ] Consider checksums for asset updates deployed via CI.

## A09: Security Logging and Alerting Failures

- [x] Add structured logging for API errors and high score submissions.
- [x] Add basic alerting hooks (e.g., log on excessive failures).

## A10: Mishandling of Exceptional Conditions

- [x] Add global error handling for server routes to avoid unhandled exceptions.
- [x] Gracefully handle DB errors and return safe error responses.
