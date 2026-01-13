# Tasks: Automated SSH Deployment

**Feature**: Automated SSH Deployment
**Spec**: /Users/magnus/src/Work/VibeFixer/specs/008-deploy-ssh-action/spec.md
**Plan**: /Users/magnus/src/Work/VibeFixer/specs/008-deploy-ssh-action/plan.md

## Phase 1: Setup

- [ ] T001 Add deployment workflow skeleton in `.github/workflows/deploy.yml`
- [ ] T002 Document deployment prerequisites and secrets in `README.md`

## Phase 2: Foundational

- [ ] T003 Add Dockerfile for backend serving frontend in `/Users/magnus/src/Work/VibeFixer/Dockerfile`
- [ ] T004 Add Docker Compose file for backend service in `/Users/magnus/src/Work/VibeFixer/docker-compose.yml`

## Phase 3: User Story 1 (P1) - Automated deployment on main

**Story Goal**: Deploy automatically on main using SSH to update the remote server.

**Independent Test Criteria**: Merge to main triggers workflow and updates `~/vibefixerapp` on the server.

- [ ] T005 [US1] Configure GitHub Action to sync repo to `~/vibefixerapp` over SSH in `.github/workflows/deploy.yml`
- [ ] T006 [US1] Configure GitHub Action to run Docker Compose on the server in `.github/workflows/deploy.yml`

## Phase 4: User Story 2 (P2) - Stable backend connectivity

**Story Goal**: Ensure backend listens on port 3333 and frontend points to it.

**Independent Test Criteria**: Public site loads and API calls succeed through reverse proxy.

- [ ] T007 [US2] Set backend PORT to 3333 in `docker-compose.yml`
- [ ] T008 [US2] Ensure frontend API base URL remains relative in `frontend/src/game/session-api.js`

## Phase 5: User Story 3 (P3) - Local development remains intact

**Story Goal**: Keep local dev workflow unchanged.

**Independent Test Criteria**: Local `node backend/src/server.js` still works.

- [ ] T009 [US3] Confirm Docker additions do not change local run steps in `README.md`

## Phase 6: Polish & Cross-Cutting

- [ ] T010 Add deployment troubleshooting notes to `README.md`

## Dependencies

- US1 depends on Setup + Foundational tasks.
- US2 depends on Foundational tasks.
- US3 depends on documentation tasks only.

## Parallel Execution Examples

- US1 tasks (T005, T006) can run after T003/T004 are done.
- US2 tasks (T007, T008) can run in parallel after T003/T004.

## Implementation Strategy

Start with Dockerfiles and compose (T003-T004), then wire up GitHub Action deployment (T005-T006). Ensure port and API assumptions (T007-T008), and finalize documentation (T002, T009, T010).
