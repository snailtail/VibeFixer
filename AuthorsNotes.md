# Notes from the Author

Well Co-author anyways...


## Todo

_None._

## Done

- The `latestCompletedAt` value from the api/sessions/stats should not include timestamps from  abandoned sessions, only completed games/sessions such that the session has been ended "properly" via the API by the frontend or whatever client. (2026-01-14 08:06 UTC)
- Toaster message for when the second Vibe coder is about to spawn needs to be shown 2 seconds longer. (2026-01-14 08:06 UTC)
- I think a session should not be treated as activated/created until the player has pressed the action key to "start" the game. or else any time one visits the app's webpage, there will be a new session, and it will probably time out after 120 seconds of inactivity, and that complicates things for saving stats for sessions if the session has already timed out before the game has ended. (2026-01-14 08:18 UTC)
- High scores! We should give the player an opportunity to save their name/gamer tag when they complete a game. If they did not succeed in winning the game, they get to at least save their name/gamer tag as proof that they tried ([gamer tag/name] tried to clear the sprint but left [N] code blocks behind unchecked), and if they do win, they get to save their name/gamer tag with a "Hooray, the sprint was saved by [gamer tag/name]". This should be optional upon end of a game - it does not affect abandoned games/sessions, and the "high scores" should be persisted to the database. there should be a panel at the bottom of the page listing all the high scores. (2026-01-14 08:44 UTC)
- When i finish a game, and the game asks me to save my name for high scores. the M key, spacebar, and the arrow keys don't work - since we capture those for the game input. so i can't write correctly in the name textbox. (2026-01-14 08:53 UTC)
- High score list should have an 80s arcade neon look with a retro font. (2026-01-14 09:02 UTC)
- gamer name/tag in the high score list should be glowing in a green neon color so that it stands out clearly against the surrounding colors. glowing like the timestamp is but a green neon color of suitable rgb values. (2026-01-14 09:11 UTC)
- player speed needs to increase by 20% so it is slightly easier to win - as it is now it's almost impossible to win a game. (2026-01-14 09:11 UTC)
