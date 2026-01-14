# Feature Specification: Admin Console Upgrade

**Feature Branch**: `021-admin-console`  
**Created**: 2026-01-14  
**Status**: Draft  
**Input**: User description: "Admin console improvements: persistent admin login via cookie (~30 min), separate admin pages for log viewer and high-score editor, ability to edit high scores, and admin-managed toast notices shown on / with title 'A message from the basement troll' including valid-from/valid-to times and CRUD. Admin UI can be English only."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Persistent Admin Access (Priority: P1)

As an admin, I want to stay logged in for at least 30 minutes so I can move between admin pages without re-entering credentials.

**Why this priority**: Smooth admin workflow is required to use the new admin tools.

**Independent Test**: Log in once, navigate between admin sections, and confirm session persists for 30 minutes.

**Acceptance Scenarios**:

1. **Given** valid admin credentials, **When** the admin logs in, **Then** a session cookie is issued and access remains for 30 minutes.
2. **Given** an active admin session, **When** the admin navigates to another admin page, **Then** no re-login is required.

---

### User Story 2 - Admin Manage High Scores (Priority: P2)

As an admin, I want to view, edit, and delete high score entries so I can correct or remove inappropriate entries.

**Why this priority**: High scores are public-facing and need moderation tools.

**Independent Test**: Modify a high score entry and confirm it updates in the list.

**Acceptance Scenarios**:

1. **Given** existing high scores, **When** the admin edits an entry, **Then** the change is persisted and visible in the list.
2. **Given** a high score entry, **When** the admin deletes it, **Then** it no longer appears in the list.

---

### User Story 3 - Admin Broadcast Notices (Priority: P3)

As an admin, I want to create time-bound notices so all visitors see a toast message on the game page.

**Why this priority**: Allows operational messaging for outages or gameplay changes.

**Independent Test**: Create a notice with valid-from/valid-to and confirm it appears on the main page.

**Acceptance Scenarios**:

1. **Given** a notice valid for the current time, **When** a player visits `/`, **Then** a toast titled "A message from the basement troll" appears.
2. **Given** a notice outside its valid window, **When** a player visits `/`, **Then** no toast is shown.
3. **Given** an active notice, **When** the player closes it, **Then** it is dismissed for that visit.

---

### User Story 4 - Admin Game Settings (Priority: P4)

As an admin, I want to adjust player speed so I can fine-tune game difficulty without restarting the backend.

**Why this priority**: Operational tuning is useful but secondary to core admin functions.

**Independent Test**: Set player speed to 120%, start a new game, and confirm player movement is faster.

**Acceptance Scenarios**:

1. **Given** an admin session, **When** the admin saves a valid player speed, **Then** the value is persisted.
2. **Given** a stored player speed, **When** a new game session starts, **Then** the player speed uses that value.
3. **Given** an out-of-range speed, **When** the admin saves it, **Then** the request is rejected.
4. **Given** the game settings page, **When** the admin adjusts player speed, **Then** the control uses a slider within the allowed range.

---

### Edge Cases

- If an admin session expires mid-action, the request fails with a session-expired error and no partial changes are saved.
- If multiple notices overlap, all active notices are shown in valid-from order, with up to 3 visible at once.
- If valid-to is earlier than valid-from, the request is rejected with a validation error.
- If a player speed value is outside the allowed range, the request is rejected with a validation error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an admin login session via cookie lasting at least 30 minutes.
- **FR-002**: System MUST allow admins to navigate between admin pages without re-authentication during the session.
- **FR-003**: System MUST provide separate admin pages for log viewer and high-score management.
- **FR-004**: System MUST allow admins to view, edit, and delete high score entries.
- **FR-005**: System MUST allow admins to create, edit, and delete broadcast notices.
- **FR-006**: System MUST display active notices as toast messages on `/` with the title "A message from the basement troll".
- **FR-007**: System MUST enforce valid-from/valid-to windows for notices (default valid-from is now).
- **FR-008**: Admin UI MUST be English-only.
- **FR-009**: System MUST provide an admin game settings section for player speed.
- **FR-010**: System MUST allow admins to set player speed between 50% and 150% (inclusive).
- **FR-011**: System MUST persist game settings in the database.
- **FR-012**: System MUST read player speed from storage when each new game session starts.
- **FR-013**: Admin UI MUST use a slider control for player speed.
- **FR-014**: Game settings update endpoints MUST require an authenticated admin session.

### Key Entities *(include if feature involves data)*

- **Admin Session**: Authenticated session with expiry time.
- **Admin Notice**: Message with title, body, valid-from, valid-to, and status.
- **High Score Entry**: Existing score record with editable fields.
- **Game Setting**: Persisted configuration values such as player speed.

### Assumptions

- Admin authentication remains username/password based.
- Notices are stored server-side and shared across all clients.
- Admin console should be structured to allow adding future game settings pages (e.g., sprint duration, imp spawn rules).
- Player speed defaults to the current behavior (100%) until changed by admin.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin sessions persist for at least 30 minutes without re-login.
- **SC-002**: Admin can edit or delete a high score entry within 1 minute.
- **SC-003**: Active notice appears for all new visitors within 5 seconds of page load.
- **SC-004**: Notices outside their time window are never shown.
- **SC-005**: Player speed changes apply to new sessions within 5 seconds of admin save.
