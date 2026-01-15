# Quickstart: Sessions Today Count

## Goal

Verify that the admin System Stats pane shows a "Sessions Today" count that matches sessions started within the current day boundary.

## Preconditions

- Backend and frontend are running locally.
- You have admin access to `/admin`.

## Steps

1. Start or simulate one or more sessions that begin today.
2. Open `/admin` and locate the System Stats pane.
3. Confirm the "Sessions Today" value matches the number of sessions started today.
4. If no sessions started today, confirm the value displays `0`.

## Expected Results

- The "Sessions Today" value is visible in the System Stats pane.
- The count matches known session starts within the current day boundary.
