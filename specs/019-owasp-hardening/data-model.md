# Data Model: OWASP Hardening (Remaining Items)

## Entities

### SecurityEvent
- **Purpose**: Captures security-relevant events for alerting.
- **Fields**:
  - `type` (string): category such as validation_failure or db_error.
  - `occurredAt` (timestamp)
  - `countInWindow` (number): count for the current minute window.
  - `threshold` (number): configured threshold (10).

### SchemaVersion
- **Purpose**: Validates storage compatibility at startup.
- **Fields**:
  - `version` (number)
  - `checkedAt` (timestamp)
  - `status` (string): ok or mismatch.

## Relationships
- SecurityEvent references the configured threshold and a rolling one-minute window.
- SchemaVersion is a singleton record linked to storage initialization.
