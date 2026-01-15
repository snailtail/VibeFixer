# Research: Background Switcher

## Decisions

### Decision 1: Keyboard-only toggle for background selection
- **Decision**: Use a single-key toggle (B key) to switch between kommun and danger backgrounds.
- **Rationale**: Aligns with the requirement to avoid on-screen controls while keeping the interaction fast and consistent with existing in-game inputs.
- **Alternatives considered**: On-screen toggle or settings panel (rejected due to explicit requirement), multi-key shortcut (adds unnecessary complexity).

### Decision 2: Store preference locally per device
- **Decision**: Persist background preference on the client device.
- **Rationale**: Matches the “same player on the same device” requirement and avoids introducing server-side user identity or new backend data paths.
- **Alternatives considered**: Server-side storage tied to sessions (requires identity and persistence changes beyond scope).

### Decision 3: Maintain gameplay performance
- **Decision**: Background switching must not interrupt gameplay or frame rate.
- **Rationale**: The change is visual only and must keep the game responsive.
- **Alternatives considered**: Forcing a pause or reload (conflicts with requirement and user experience).
