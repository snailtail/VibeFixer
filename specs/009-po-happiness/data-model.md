# Data Model: PO Happiness Status

## Entities

- **PO Mood**: Derived state (Happy, Content, Sad) computed from blocker count.
- **PO Images**: `po_happy.png`, `po_content.png`, `po_sad.png` shown based on mood.
- **Blocker Count**: Existing obstacle count used to derive mood.

## Notes

No new persistence or backend data is introduced; mood is computed in the client.
