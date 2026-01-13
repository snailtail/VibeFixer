# Research: Technical Documentation Pack

## Decision: Document architecture in root README

**Rationale**: Root README is the first entry point for technicians and operators and must describe runtime components and communications.

**Alternatives considered**:
- Separate architecture doc only (higher friction for readers)

## Decision: Maintain API reference in README with endpoint table

**Rationale**: Keeps API reference close to system overview and avoids drift.

**Alternatives considered**:
- Separate OpenAPI file (more structured but requires generator or manual syncing)

## Decision: Provide development guide in `docs/DEVELOPMENT.md`

**Rationale**: Keeps README focused while still offering detailed contribution and maintenance workflows.

**Alternatives considered**:
- Include all guidance in README (becomes too long and hard to scan)
