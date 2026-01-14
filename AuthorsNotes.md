# Notes from the Author

Well Co-author anyways...


## Todo

_None._

## Done

- The `latestCompletedAt` value from the api/sessions/stats should not include timestamps from  abandoned sessions, only completed games/sessions such that the session has been ended "properly" via the API by the frontend or whatever client. (2026-01-14 08:06 UTC)
- Toaster message for when the second Vibe coder is about to spawn needs to be shown 2 seconds longer. (2026-01-14 08:06 UTC)
- I think a session should not be treated as activated/created until the player has pressed the action key to "start" the game. or else any time one visits the app's webpage, there will be a new session, and it will probably time out after 120 seconds of inactivity, and that complicates things for saving stats for sessions if the session has already timed out before the game has ended. (2026-01-14 08:18 UTC)
