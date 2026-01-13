# Data Model: Deployment

## Entities

- **Deployment Workflow**: Workflow that ships the app and triggers container restart.
- **Deployment Target**: `~/vibefixerapp` directory and running containers.
- **Deployment Secrets**: SSH host/user/private key used to authenticate.

## Notes

No new runtime data entities or persistent storage are introduced by this feature.
