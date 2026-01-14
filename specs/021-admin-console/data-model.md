# Data Model: Admin Console Upgrade

## Entities

### AdminSession
- **Purpose**: Tracks authenticated admin session expiry.
- **Fields**:
  - `sessionId` (string)
  - `createdAt` (timestamp)
  - `expiresAt` (timestamp)

### AdminNotice
- **Purpose**: Broadcast notice shown to all visitors.
- **Fields**:
  - `id` (string)
  - `title` (string) — always rendered as "A message from the basement troll"
  - `message` (string)
  - `validFrom` (timestamp)
  - `validTo` (timestamp)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

### HighScoreEntry
- **Purpose**: Moderated score records.
- **Fields**:
  - `id` (number)
  - `playerTag` (string)
  - `result` (string)
  - `remainingUnchecked` (number)
  - `createdAt` (timestamp)

### GameSetting
- **Purpose**: Persisted configuration values for gameplay tuning.
- **Fields**:
  - `key` (string) — unique identifier (e.g., `playerSpeedPercent`)
  - `value` (number)
  - `updatedAt` (timestamp)
