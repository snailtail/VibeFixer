# Research Findings: VibeFixer Platformer

## Decision 1: Client-rendered game with lightweight session API

- **Decision**: Render gameplay fully in the browser and use a minimal server API to initialize sessions and return authoritative scoring updates.
- **Rationale**: Keeps gameplay responsive while supporting server-hosted sessions behind a reverse proxy and enabling consistent session setup.
- **Alternatives considered**:
  - Fully client-side with no API (simpler, but makes session initialization and scoring purely local).
  - Fully authoritative server simulation (more robust, but significantly more complex and unnecessary for a single-player game).

## Decision 2: Canvas 2D for rendering

- **Decision**: Use Canvas 2D rendering for sprites, terrain, and interactions.
- **Rationale**: Canvas provides predictable performance and straightforward collision handling for a 2D platformer.
- **Alternatives considered**:
  - DOM/CSS rendering (simpler UI updates but harder for physics and collisions).
  - WebGL (more powerful but adds complexity without clear need).

## Decision 3: Procedural terrain with reachability validation

- **Decision**: Generate terrain with constrained gaps and elevations and validate reachability for all artifacts.
- **Rationale**: Ensures replayability while guaranteeing every artifact is reachable by jump/run mechanics.
- **Alternatives considered**:
  - Pure random placement without validation (risk of unreachable artifacts).
  - Hand-authored levels (no replayability, higher content cost).

## Decision 4: Kenney platformer sprites for NES-style visuals

- **Decision**: Use Kenney "New Platformer Pack" sprites for the player, terrain, artifacts, and trash can.
- **Rationale**: Provides consistent Mario-like retro visuals with permissive licensing and ready-made tiles.
- **Alternatives considered**:
  - Hand-drawn pixel sprites (time-intensive).
  - Procedural color blocks (insufficiently nostalgic).
