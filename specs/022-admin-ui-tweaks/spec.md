# Feature Specification: Admin UI tweaks, high score admin list, logo update

**Feature Branch**: `022-admin-ui-tweaks`
**Created**: 2026-01-14
**Status**: Draft
**Input**: User description: "Admin UI tweaks, high score admin list, logo update"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage all high scores in admin (Priority: P1)

As an admin, I need to see every stored high score and choose one to edit or delete so I can maintain the list without being limited to the latest entry.

**Why this priority**: This is a core admin workflow and currently blocked by the single-item view.

**Independent Test**: Load the admin high score page, verify a list appears, select an entry, and complete edit/delete actions.

**Acceptance Scenarios**:

1. **Given** multiple high scores exist, **When** the admin opens the high score admin page, **Then** all high scores are listed with a clear selection mechanism.
2. **Given** a selected high score, **When** the admin edits or deletes it, **Then** the change is reflected in the list and persistence store.

---

### User Story 2 - Consolidated admin system stats (Priority: P2)

As an admin, I want the system stats panel located in the admin UI, with no duplicate stats, so all operational metrics are visible in one place.

**Why this priority**: Keeps operational metrics consistent and avoids split UI concerns.

**Independent Test**: Open the admin UI, confirm stats are present there and removed from the frontend game UI.

**Acceptance Scenarios**:

1. **Given** the frontend game UI, **When** the page loads, **Then** the system stats panel is not shown there.
2. **Given** the admin UI, **When** the page loads, **Then** the system stats panel appears with each stat shown exactly once.

---

### User Story 3 - Retro logo update (Priority: P3)

As a player, I want the game logo to match the neon/retro look of the High Scores header text while keeping the existing logo border color, so the UI feels consistent.

**Why this priority**: Improves visual cohesion without changing gameplay behavior.

**Independent Test**: Load the game UI and confirm the logo text styling matches the high score header font/color feel while the border color stays unchanged.

**Acceptance Scenarios**:

1. **Given** the game UI header, **When** the page renders, **Then** the logo text uses the same font and neon color feel as the High Scores header.
2. **Given** the logo container, **When** the new styling is applied, **Then** the border color remains unchanged from its current value.

---

### Edge Cases

- What happens when there are zero high scores? The admin list should show an empty state instead of failing.
- How does the admin list behave with many entries? It should remain usable (scrolling or simple list).
- What if a stat already appears elsewhere in admin UI? The consolidated panel must not duplicate it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Admin UI MUST list all high score entries, not only the most recent.
- **FR-002**: Admin UI MUST allow selecting a specific high score for edit or delete actions.
- **FR-003**: The high score list in admin MUST update after edit/delete operations.
- **FR-004**: System stats panel MUST be moved from the frontend game UI to the admin UI.
- **FR-005**: Admin UI MUST not show duplicate system stats values.
- **FR-006**: Game logo text MUST use the same font and neon color feel as the High Scores header text.
- **FR-007**: Game logo border color MUST remain unchanged.

### Key Entities *(include if feature involves data)*

- **HighScore**: Existing high score record (id, name, message, timestamp, stats). Admin UI consumes these.
- **SystemStat**: Existing system stats values shown in admin UI (uptime, sessions, etc.).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can view and manage any high score entry via list selection in under 30 seconds.
- **SC-002**: System stats appear only in the admin UI and not on the frontend game UI.
- **SC-003**: Logo text styling matches the High Scores header font and neon color while preserving the border color.
