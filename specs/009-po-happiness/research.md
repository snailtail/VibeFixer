# Research: PO Happiness Status

## Decision: Thresholds for PO mood

**Decision**: Happy at 0 blockers, Content at 1 to 3 blockers, Sad at 4 or more blockers.

**Rationale**: Keeps the happy state tied to a perfectly clean map while allowing a narrow "warning" band before the sad state.

**Alternatives considered**:
- Wider content range (less sensitive to small blocker counts)
- Mood based on blocker percentage instead of absolute count

## Decision: Image scaling inside PO STATUS panel

**Decision**: Constrain the PO image to fit within the PO STATUS panel using max-width and max-height styling.

**Rationale**: Keeps the layout stable and prevents the image from stretching the panel.

**Alternatives considered**:
- Cropping images (risk of cutting off the face)
- Forcing a fixed pixel size (could distort on different displays)
