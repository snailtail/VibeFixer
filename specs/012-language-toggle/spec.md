# Feature Specification: Language Toggle

**Feature Branch**: `012-language-toggle`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "I would like to be able to choose language for my game, between Swedish and English. It should persist like the mute or unmute selection does."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch language (Priority: P1)

As a player, I want to switch the UI language between Swedish and English so I can read the game in my preferred language.

**Why this priority**: Language selection is the core value of this feature.

**Independent Test**: Can be tested by switching languages and verifying all visible UI text updates.

**Acceptance Scenarios**:

1. **Given** the game is loaded, **When** I select Swedish, **Then** the UI text updates to Swedish.
2. **Given** the game is loaded, **When** I select English, **Then** the UI text updates to English.

---

### User Story 2 - Persist language choice (Priority: P2)

As a player, I want my language choice to persist across reloads so I don't have to reselect it every time.

**Why this priority**: Persistence reduces friction and matches mute behavior.

**Independent Test**: Can be tested by changing language, refreshing the page, and confirming the same language remains.

**Acceptance Scenarios**:

1. **Given** I choose Swedish, **When** I reload the page, **Then** the UI remains in Swedish.
2. **Given** I choose English, **When** I reload the page, **Then** the UI remains in English.

---

### Edge Cases

- What happens if stored language is missing or invalid? (Default to English.)
- What happens if new UI strings are added? (They should be translated in both languages.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The UI MUST allow selecting between Swedish and English.
- **FR-002**: The selected language MUST update all visible UI text immediately.
- **FR-003**: The selected language MUST persist across page reloads.
- **FR-004**: If no language is stored, the default MUST be English.
- **FR-005**: Language selection MUST not affect game logic or scoring.

### Key Entities *(include if feature involves data)*

- **Language Preference**: Persisted user choice between Swedish and English.
- **UI Text Map**: Dictionary of translated UI strings.

### Assumptions

- UI text is centralized so translations can be applied consistently.
- Language preference can be stored in local storage similar to mute state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Language selection updates all visible labels within 1 second.
- **SC-002**: Language preference persists across 100% of page reloads.
- **SC-003**: Default English loads when no preference exists.
