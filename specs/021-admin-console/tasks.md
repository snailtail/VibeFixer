# Tasks: Admin Console Upgrade

**Input**: Design documents from `/specs/021-admin-console/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested in spec; no test tasks included.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare admin session, notice, and game settings storage foundations

- [x] T001 Add admin session storage table in `backend/src/storage/sqlite.js`
- [x] T002 [P] Add admin notice storage table in `backend/src/storage/sqlite.js`
- [x] T003 [P] Add game settings storage table in `backend/src/storage/sqlite.js`
- [x] T004 Create admin notice repository in `backend/src/storage/admin-notice-repo.js`
- [x] T005 Create game settings repository in `backend/src/storage/game-settings-repo.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared auth/session utilities for admin pages

- [x] T006 Add admin session helpers in `backend/src/security/admin-session.js`
- [x] T007 [P] Add admin login/logout API handlers in `backend/src/api/admin-auth.js`
- [x] T008 Wire admin auth routes in `backend/src/server.js`
- [x] T009 [P] Add admin cookie config in `backend/src/security/policy.js`

**Checkpoint**: Admin session cookie works and is shared across admin pages

---

## Phase 3: User Story 1 - Persistent Admin Access (Priority: P1) 

**Goal**: Admin session persists across admin pages for 30 minutes

**Independent Test**: Log in, navigate between admin pages, confirm session persists

### Implementation

- [x] T010 [US1] Add `/admin` landing page with nav links in `frontend/admin.html`
- [x] T011 [US1] Create admin session login page in `frontend/admin-login.html`
- [x] T012 [US1] Add admin login script in `frontend/src/admin/login.js`
- [x] T013 [US1] Protect admin pages by checking session cookie in `frontend/src/admin/session.js`

**Checkpoint**: Admin can log in once and navigate between admin pages

---

## Phase 4: User Story 2 - Admin Manage High Scores (Priority: P2)

**Goal**: Admin can view, edit, and delete high scores

**Independent Test**: Update a high score and verify the list reflects changes

### Implementation

- [x] T014 [US2] Add admin high score endpoints in `backend/src/api/admin-high-scores.js`
- [x] T015 [US2] Add update/delete support in `backend/src/storage/high-score-repo.js`
- [x] T016 [US2] Create admin high score page in `frontend/admin-high-scores.html`
- [x] T017 [US2] Implement admin high score UI in `frontend/src/admin/high-scores.js`

**Checkpoint**: Admin can edit/delete entries and see updates

---

## Phase 5: User Story 3 - Admin Broadcast Notices (Priority: P3)

**Goal**: Admin can manage notices that display on `/`

**Independent Test**: Create a notice and verify it appears on the game page

### Implementation

- [x] T018 [US3] Add admin notice endpoints in `backend/src/api/admin-notices.js`
- [x] T019 [US3] Add active notice endpoint for game clients in `backend/src/api/notices.js`
- [x] T020 [US3] Add admin notices page in `frontend/admin-notices.html`
- [x] T021 [US3] Implement admin notices UI in `frontend/src/admin/notices.js`
- [x] T022 [US3] Add toast notice rendering to `frontend/src/app.js`

**Checkpoint**: Notices are created/edited and appear on `/` when valid

---

## Phase 6: User Story 4 - Admin Game Settings (Priority: P4)

**Goal**: Admin can adjust player speed and have it apply to new sessions

**Independent Test**: Set player speed to 120% and confirm the next session uses it

### Implementation

- [x] T023 [US4] Add admin game settings endpoints in `backend/src/api/admin-game-settings.js`
- [x] T024 [US4] Apply stored player speed when starting sessions in `backend/src/game/session-store.js`
- [x] T025 [US4] Add admin game settings page in `frontend/admin-game-settings.html`
- [x] T026 [US4] Implement admin game settings UI (slider control) in `frontend/src/admin/game-settings.js`
- [x] T027 [US4] Add game settings link to admin nav in `frontend/admin.html`

**Checkpoint**: Player speed changes apply to new sessions without restart

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T028 [P] Add admin navigation styling in `frontend/admin.css`
- [x] T029 Update `README.md` with new admin pages and game settings
- [ ] T030 Run quickstart validation from `specs/021-admin-console/quickstart.md`

---

## Dependencies & Execution Order

- **Phase 1 → Phase 2**: T001–T005 before session utilities
- **Phase 2 → US1/US2/US3/US4**: T006–T009 required before admin pages
- **US1**: Should complete before US2/US3/US4 to ensure auth in place
- **US2/US3/US4**: Can proceed in parallel after US1
- **Polish**: After story tasks

## Parallel Opportunities

- T001 and T002 can run in parallel
- T014 and T018 can run in parallel (separate APIs)
- Frontend pages (T016, T020, T025) can be built in parallel

## Parallel Example: User Story 4

```text
- [x] T023 [US4] Add admin game settings endpoints in backend/src/api/admin-game-settings.js
- [x] T025 [US4] Add admin game settings page in frontend/admin-game-settings.html
```

## Implementation Strategy

- **MVP**: Complete Phase 1 → Phase 2 → US1, validate session persistence.
- **Incremental**: Add US2 (high score management), US3 (notices), US4 (game settings), then polish.
