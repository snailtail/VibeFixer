# Data Model

## Security Policy

**Purpose**: Central definition for security controls.

**Fields**:
- `writeRateLimitPerIpPerMinute` (number) — default 60.
- `securityHeaders` (list) — header names applied to responses.
- `retentionSessionsDays` (number) — default 30 days.
- `retentionHighScoresDays` (number) — default 180 days.

## Security Log Entry

**Purpose**: Structured log record for security-relevant events.

**Fields**:
- `timestamp` (ISO 8601 string)
- `eventType` (string; e.g., `rate_limit`, `validation_failed`, `server_error`)
- `ip` (string)
- `path` (string)
- `details` (object; sanitized)
