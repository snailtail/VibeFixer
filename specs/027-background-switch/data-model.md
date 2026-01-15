# Data Model: Background Switcher

## Entities

### Background Preference

- **Purpose**: Store the last selected background for a player on the same device.
- **Fields**:
  - **selectedBackground**: One of {kommun, danger}.
  - **updatedAt**: Timestamp of the last change.
- **Validation Rules**:
  - If value is missing or invalid, default to kommun.
- **Lifecycle**:
  - Created or updated when the player toggles the background.
  - Read on game load to initialize the background state.
