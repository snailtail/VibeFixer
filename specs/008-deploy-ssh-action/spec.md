# Feature Specification: Automated SSH Deployment

**Feature Branch**: `008-deploy-ssh-action`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "Deploy to public web server I need to be able to publish this web app to my ubuntu server via GitHub action on PR’s to main I will provide these secrets available to the GitHub action in the repo itself: SSH_HOST SSH_USER SSH_PRIVATE_KEY They can be used to access the ubuntu server via SSH / SCP I want to deploy this web app to a subfolder in the home directory called vibefixerapp I need it to run and expose the port 3333 for the backend, and use that from the frontend. The frontend will be reached / routed /proxyd via my Caddy Proxy - using TLS and a custom subdomain via cloud flare. Do whatever preparations are necessary in order to be able to perform such a deployment. I still also want to be able to run/test the app locally as we have done thus far."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automated deployment on main (Priority: P1)

As a maintainer, I want deployments to happen automatically when changes land in main so the public server stays current without manual steps using the server’s container runtime.

**Why this priority**: Getting updates live quickly is the core value of this feature.

**Independent Test**: Can be tested by merging a PR into main and confirming the server receives the updated build and services restart successfully in the container runtime.

**Acceptance Scenarios**:

1. **Given** a PR is merged to main, **When** the automation runs, **Then** the latest version is deployed to the server under `~/vibefixerapp` as containerized services.
2. **Given** the automation runs, **When** it completes, **Then** the backend is running and reachable through the configured reverse proxy path.

---

### User Story 2 - Stable backend connectivity (Priority: P2)

As a player, I want the frontend to reliably talk to the backend on the server so the game works after deployment.

**Why this priority**: A deployment that breaks connectivity makes the game unusable.

**Independent Test**: Can be tested by loading the public URL and verifying the game starts and server sessions are created via the containerized backend.

**Acceptance Scenarios**:

1. **Given** the deployment is live, **When** the frontend loads, **Then** it uses the backend service running on port 3333.
2. **Given** the backend is running, **When** the reverse proxy routes traffic, **Then** API calls succeed without manual intervention.

---

### User Story 3 - Local development remains intact (Priority: P3)

As a developer, I want local run/test workflows to keep working so I can iterate without the deployment pipeline in the way.

**Why this priority**: Local development is needed for ongoing game changes.

**Independent Test**: Can be tested by running the app locally and confirming behavior matches pre-deployment workflow.

**Acceptance Scenarios**:

1. **Given** a developer runs the app locally, **When** they start frontend and backend, **Then** the app behaves as it did before deployment automation.

---

### Edge Cases

- What happens if deployment secrets are missing or invalid? (Deployment fails with a clear error and no partial update.)
- What happens if the server is unreachable? (Deployment fails safely without corrupting the remote directory.)
- What happens if the deployment step is triggered multiple times? (Latest deployment wins without leaving the app in a broken state.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST deploy automatically when changes land in main via the repository workflow.
- **FR-002**: The deployment MUST connect to the server using repository-provided SSH secrets.
- **FR-003**: The deployment MUST place the app under `~/vibefixerapp` on the target host.
- **FR-004**: The deployment MUST run the app as containerized services on the server.
- **FR-005**: The backend service MUST run on port 3333 after deployment.
- **FR-006**: The frontend MUST route API calls to the backend service running on port 3333 via the reverse proxy.
- **FR-007**: Local development workflows MUST remain usable without requiring deployment credentials.
- **FR-008**: Deployment failures MUST be reported in the workflow output.

### Key Entities *(include if feature involves data)*

- **Deployment Workflow**: Automation that performs the remote update and restart.
- **Deployment Target**: The remote directory and containerized services on the Ubuntu host.
- **Deployment Secrets**: SSH host/user/private key used for authentication.

### Assumptions

- The reverse proxy is already configured to forward traffic to the backend on port 3333.
- The server user has permission to create and manage `~/vibefixerapp`.
- Port 3333 is open and available on the host.
- The server has a container runtime available for running the app.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Deployment completes within 5 minutes of a main update in 95% of runs.
- **SC-002**: The backend service responds successfully on port 3333 after every deployment.
- **SC-003**: The public site loads and creates a playable session within 30 seconds of deployment.
- **SC-004**: Local development start-up steps remain unchanged for developers.
