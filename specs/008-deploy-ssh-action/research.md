# Research: Automated SSH Deployment

## Decision: Use Docker Compose on the target host

**Rationale**: The server already runs Docker, so containerized deployment provides consistent runtime, easy restarts, and clear isolation without changing local workflows.

**Alternatives considered**:
- Direct Node.js + systemd service (simpler but more manual environment management)
- Running the app via manual SSH commands (less repeatable, higher drift risk)

## Decision: Deploy by syncing the repository to `~/vibefixerapp` over SSH

**Rationale**: Using rsync/scp with SSH secrets avoids the need for a container registry and keeps deployment simple while still deterministic.

**Alternatives considered**:
- Building/pushing images to a registry (requires registry setup and credentials)
- Git pull on server (requires server-side Git credentials and access management)

## Decision: Configure backend port with environment variable for deployment

**Rationale**: The backend already respects `PORT`; setting it to 3333 in container runtime meets the requirement without changing local defaults.

**Alternatives considered**:
- Hardcoding port changes in code (would affect local development)
- Proxying internally to another port (unnecessary complexity)
