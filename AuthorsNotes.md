# Notes from the Author

Well Co-author anyways...

## Reflektioner

Med spec-kit är det lite "stolpigare" att vibe:a, man får inte samma chattiga flow hela tiden, men samtidigt har jag känslan av att jag hela tiden har koll på specar, planer, val som görs, regler jag satt upp, och varje ny feature/iteration lagras med sin separata dokumentation. jag kan närsomhelst välja att bara vibe:a i Codex med chat och förbigå spec-kit's promptar om jag vill. Jag har testat lite av varje. Men när det kommer till att lägga till en ny feature t ex så känns det stabilt att välja att göra en specify först, och sen planera, skapa tasks steg för steg. Ibland har jag låtit codex köra på själv med minimal input från mig, ibland har jag valt att gå in och redigera .md filerna manuellt innan nästa steg. Någon gång testade jag clarify för att bena i vissa vägval och reda ut edge-cases. 

Det går snabbt, ibland blir det fel - men har man en tydlig målbild och vet var man vill hamna så blir det ofta ganska rätt ganska snabbt så länge man klarar av att uttrycka sitt behov.  
Jag gillar att man formulerar user stories, det alignar ju bra med hur vi skulle kunna ta in uppdrag från verksamheten när det är lite större saker, att bygga user stories tillsammans, som blir basen för AI-assisterat utvecklad produkt.  
Dessutom har jag testat att avsluta mitt vibe:ande och påbörja det igen lite senare, för att se hur det funkar att fortsätta från "där man lämnade sist" och det är inga problem.

Och är man klar med features, har sin repo incheckad i nån versionshantering, och kommer på att man behöver lägga till eller ändra något så är det ju bara att checka ut det hela och låta codex gå loss igen. Även om man inte har en gammal session som går att återuppta lokalt - den kommer ju ha alla specs, vägval, regler, kodbasen, ja allt. Det tar säkert en stund att analysera och ett gäng tokens går åt till att komma igång igen, men sen är det nog bara att tuta och köra.

Vad gäller kodkvaliteten så i detta fallet lät jag den välja tech-stack själv, det blev javascript vilket jag inte normalt sett jobbar med. Så jag har inte suttit och granskat koden som sådan. Skulle detta vara någon enterprise app för produktion hade jag kanske styrt upp att det skulle vara enligt våra riktlinjer med våra föredragna stack:ar i botten, och då även kunnat enklare göra kodgranskning.

Däremot tycker jag att jag har haft bra överblick över vad codex gjort, jag får ju bekräfta eller neka saker den försöker göra - den ber om lov innan den gör saker som kan vara disruptiva på något vis.

I början förde jag löpande noteringar vid sidan av, för att inte störa processen när jag kom på buggar eller nya grejer jag ville ha. För att inte blanda in orelaterade saker i en pågående featurebranch så att säga. Sen lade jag in ett eget .md dokument för AuthorsNotes - där jag lägger in Todo items, och har bett codex att gå igenom det och fixa dem - samt flytta de färdiga items till Done istället i samma fil. Denna fil. Det har fungerat väl för att hålla småfix på en plats, men ändå noterat vad som gjorts och när, och sen hålla större grejer som features i egna branches och med egna subfolders här för specs och dylikt.

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
- Go through the OWASP Top 10:2025 list and make sure we are not vulnerable. If you find vulnerabilities or things that need to be fixed, document them separately as Todo tasks in an OWASP_TODO.md file - we will plan this and implement later. (see also https://owasp.org/Top10/2025/ ) (2026-01-14 09:37 UTC)
