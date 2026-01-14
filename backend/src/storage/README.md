# Storage Module

This directory contains the SQLite persistence layer for VibeFixer.

## Files

- `config.js`: Resolves the database path and ensures the data directory exists.
- `sqlite.js`: Opens the SQLite database and initializes the schema.
- `serializers.js`: JSON serialization helpers for session payloads.
- `session-repo.js`: Repository functions for sessions and stats.

## Extending Storage

- Add new tables in `sqlite.js` and bump the schema version when needed.
- Keep schema changes backward compatible where possible.
- Store new data types as separate tables to avoid bloating the session payload.

