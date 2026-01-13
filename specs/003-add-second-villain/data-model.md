# Data Model: Second Vibe Coder + Toast

## VibeCoder

- **Fields**: id, positionX, positionY, direction, speed, dropIntervalSeconds, active
- **Relationships**: belongs to GameSession
- **Validation**: speed matches base coder speed; active toggles at 30 seconds for coder 2

## ToastMessage

- **Fields**: id, text, startTime, durationSeconds, visible
- **Relationships**: belongs to GameSession
- **Validation**: visible only during configured window before coder 2 spawns

## GameSession (updates)

- **Fields**: secondCoderEnabled (boolean), toastShown (boolean)
- **Relationships**: has many VibeCoders
- **Validation**: secondCoderEnabled flips at 30 seconds elapsed
