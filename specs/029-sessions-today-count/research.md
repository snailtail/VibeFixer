# Research: Sessions Today Count

## Sessions Today Definition

- Decision: Define "Sessions Today" as sessions with a start time within the system's existing "today" boundary and timezone.
- Rationale: Keeps the metric consistent with other daily stats and avoids conflicting day boundaries.
- Alternatives considered: Allowing admins to choose a timezone or custom range; rejected to keep scope minimal.

## Data Source for Counting Sessions

- Decision: Count sessions based on stored session start timestamps.
- Rationale: Session start time is the authoritative signal for whether a session began today.
- Alternatives considered: Using the cumulative "sessions started" counter; rejected because it does not isolate today's starts.
