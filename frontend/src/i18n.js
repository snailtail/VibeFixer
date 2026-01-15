const STORAGE_KEY = "vibefixer:lang";
const DEFAULT_LANGUAGE = "en";
const LANGUAGES = ["en", "sv"];

const STRINGS = {
  en: {
    ui: {
      languageLabel: "Language",
      languageEnglish: "English",
      languageSwedish: "Swedish",
      controlsLabel: "Controls:",
      controlsText: "← Move left\n→ Move right\n↑ Jump\nSpace Action (Pick up / Drop)\nM Mute\nB Background",
      controlsTextTouch: "L Move left\nR Move right\nJ Jump\nA Action\nTwo-finger tap Mute\nThree-finger tap Background",
      instructionsTitle: "Instructions",
      instructionsText:
        "Your mission is to pick up all code blocks dropped by the vibe coders, bring them to the Code review bin and drop them there.\n" +
        "You can only pick up and carry one code block at a time.\n" +
        "You can crush blockers to make the PO less worried, though this has no direct impact on the game other than possibly making it easier to get to the code blocks.\n" +
        "Try to keep the level clear of unchecked code blocks. To win you need to have 0 code blocks unchecked when the timer ends.\n" +
        "If you hold a code block and can jump high enough to touch a vibe coder with it, the vibe coder will be temporarily stunned.",
      gameEventsTitle: "Game Events",
      poStatusTitle: "PO Status",
      sessionStatsTitle: "Session Stats",
      sessionStatsActive: "Active",
      sessionStatsStarted: "Started",
      sessionStatsEnded: "Ended",
      sessionStatsStale: "Auto-ended",
      sessionStatsWon: "Won",
      sessionStatsLost: "Lost",
      sessionStatsAbandoned: "Abandoned",
      sessionStatsLatest: "Latest ended",
      touchLeft: "Move left",
      touchRight: "Move right",
      touchJump: "Jump",
      touchAction: "Action",
      touchToggleShow: "Show touch controls",
      touchToggleHide: "Hide touch controls",
      systemStatsTitle: "System Stats",
      systemStatsStarted: "Backend started",
      systemStatsUptime: "Uptime",
      systemStatsSessionsStarted: "Sessions started",
      systemStatsSessionsActive: "Sessions active",
      systemStatsSessionsEnded: "Sessions ended",
      systemStatsLatestActivity: "Latest activity",
      adminLogsTitle: "Admin Logs",
      adminLogsStatusDisconnected: "Not connected",
      adminLogsStatusConnected: "Connected",
      adminLogsStatusMissing: "Enter credentials",
      adminLogsStatusError: "Connection error",
      adminLogsEmpty: "No logs found.",
      highScoresTitle: "High Scores",
      highScorePromptTitle: "Save Your Run",
      highScorePromptWon: "Sprint saved! Add your gamer tag?",
      highScorePromptLost: "Tough sprint. Add your gamer tag anyway?",
      highScoreNameLabel: "Gamer tag",
      highScoreNamePlaceholder: "Enter your name",
      highScoreSave: "Save",
      highScoreSkip: "Skip",
      highScoreEmpty: "No runs saved yet.",
    },
    story: {
      title: "Story",
      text:
        "The Vibe Coders roam free in the top floor of City Hall.\n" +
        "They have a habit of raining unchecked code down into the basement.\n" +
        "You are the Vibe Fixer — sprint fast, review faster, and keep the code moving before the timer ends.\n" +
        "If the backlog piles up, the customers’ FOMO Demon awakens and the sprint turns grim.\n" +
        "" +
        "You can try to clear blockers to keep the Product Owner calm, but beware the tiny demon Imp Ediment, who teleports in to stack up new obstacles. Smash a blocker from below to break it, or vault over it if you care more about speed than the Product Owners blood pressure...",
    },
    cast: {
      title: "Cast",
      fixer: {
        name: "The Fixer",
        bio: "Municipality hero, fast on the keyboard and faster on the cleanup.",
        alt: "The Fixer",
      },
      coder: {
        name: "Vibe Coder",
        bio: "Top-floor chaos agent dropping unchecked code at the worst times.",
        alt: "Vibe Coder",
      },
      imp: {
        name: "Imp Ediment",
        bio: "Teleporting mischief-maker who stacks blockers in your way.",
        alt: "Imp Ediment",
      },
      fomo: {
        name: "FOMO Demon",
        bio: "Feeds on lingering code. Defeat it by keeping the ground clean.",
        alt: "FOMO Demon",
      },
      po: {
        name: "Product Owner",
        bio: "Guardian of scope and sanity, happiest when blockers hit zero.",
        alt: "Product Owner",
      },
      root: {
        name: "Root",
        bio: "An unseen force practicing code-fu in the shadows, while waiting for the perfect merge.",
        alt: "Root",
      },
    },
    credits: {
      title: "Credits",
      items: [
        "Kenney New Platformer Pack (CC0) — sprites for characters and tiles.",
        "OpenGameArt CC0 audio — chiptune music and sound effects.",
        "kommun_bg.png background — CC0 by Magnus.",
        "Custom sprites (PO + bosses) — Magnus.",
        "Co-authors: Magnus & Codex.",
      ],
    },
    highScores: {
      won: (tag) => `Sprint saved by ${tag}.`,
      lost: (tag, remaining) =>
        `${tag} tried to clear the sprint but left ${remaining} unchecked code block${remaining === 1 ? "" : "s"} behind.`,
    },
    hud: {
      unchecked: "Unchecked code",
      blockers: "Blockers",
      sound: "Sound",
      on: "On",
      off: "Off",
      sprintEndsIn: "Sprint ends in",
      gameOver: "Game Over",
      reload: "Reload the page to try again",
    },
    overlays: {
      pressStart: "Press Space to Start",
      startLines: [
        "A vibe coder is on the loose on the top floor of the municipality,",
        "dropping fresh unchecked code into the basement.",
        "You’re the Vibe Fixer —> grab as much as you can and toss it into the Code Review Bin.",
        "Hurry up: your sprint ends in 60 seconds, as requested by the demanding customers.",
        "Press M to mute or unmute the music.",
      ],
      fomoGameOver: "GAME OVER",
      fomoTitle: "FOMO DEMON ENRAGED",
      fomoLine: "Unchecked code remains. The demon is furious.",
    },
    toast: {
      secondCoderWarning: "Uh oh, the customer has hired another vibe coder. Let’s try to keep up!",
      impWarning: "Oh no Imp Ediment is out and about placing blockers, look out!",
      rateLimit: "Too many actions at once - slow down a bit.",
      cAllergy: "You used C. The vibe coders are allergic and slow down!",
    },
    gameOver: {
      defeated: "FOMO Demon defeated! The code is clean.",
      enraged: "FOMO Demon enraged! Unchecked code remains.",
    },
    log: {
      brokeBlockers: (count) => `Broke ${count} blocker${count === 1 ? "" : "s"}.`,
      deposited: "Deposited unchecked code in the bin.",
      coderDrop: (id) => `Vibe coder #${id} dropped unchecked code.`,
      warningSecond: "Warning: vibe coder #2 is about to join.",
      secondJoined: "Vibe coder #2 joined the chaos.",
      coderStunned: (id) => `Vibe coder #${id} stunned.`,
      coderRecovered: (id) => `Vibe coder #${id} recovered.`,
      poMoodChange: (label) => `PO mood is now ${label}.`,
      cAllergy: () => "C allergy triggered: coders slowed.",
      impAppeared: (count) =>
        `Imp Ediment appeared: placing ${count} blocker${count === 1 ? "" : "s"}.`,
      fomoRise: "The FOMO Demon rises. Unchecked code feeds its rage.",
    },
    poMood: {
      happy: "Happy",
      content: "Content",
      sad: "Worried",
    },
  },
  sv: {
    ui: {
      languageLabel: "Språk",
      languageEnglish: "Engelska",
      languageSwedish: "Svenska",
      controlsLabel: "Kontroller:",
      controlsText: "← Gå vänster\n→ Gå höger\n↑ Hoppa\nMellanslag Åtgärd (Plocka upp / Släpp)\nM Ljud av/på\nB Bakgrund",
      controlsTextTouch: "L Gå vänster\nR Gå höger\nJ Hoppa\nA Åtgärd\nTvå fingrar tryck Ljud av/på\nTre fingrar tryck Bakgrund",
      instructionsTitle: "Instruktioner",
      instructionsText:
        "Ditt uppdrag är att plocka upp alla kodblock som vibe-kodarna släpper, ta dem till Code review bin och släpp dem där.\n" +
        "Du kan bara plocka upp och bära ett kodblock åt gången.\n" +
        "Du kan krossa blockers för att få PO att bli mindre orolig, men det påverkar inte spelet direkt förutom att det kan bli enklare att komma åt kodblocken.\n" +
        "Försök att hålla banan fri från okontrollerade kodblock. För att vinna måste du ha 0 okontrollerade kodblock kvar när timern tar slut.\n" +
        "Om du håller i ett kodblock och kan hoppa tillrackligt högt för att nudda en vibe-kodare med det, blir vibe-kodaren tillfälligt paralyserad.",
      gameEventsTitle: "Spelhändelser",
      poStatusTitle: "PO-status",
      sessionStatsTitle: "Sessionstatistik",
      sessionStatsActive: "Aktiva",
      sessionStatsStarted: "Startade",
      sessionStatsEnded: "Avslutade",
      sessionStatsStale: "Autoavslutade",
      sessionStatsWon: "Vunna",
      sessionStatsLost: "Förlorade",
      sessionStatsAbandoned: "Övergivna",
      sessionStatsLatest: "Senast avslutad",
      touchLeft: "Gå vänster",
      touchRight: "Gå höger",
      touchJump: "Hoppa",
      touchAction: "Åtgärd",
      touchToggleShow: "Visa touchkontroller",
      touchToggleHide: "Dölj touchkontroller",
      systemStatsTitle: "Systemstatus",
      systemStatsStarted: "Backend startad",
      systemStatsUptime: "Drifttid",
      systemStatsSessionsStarted: "Sessioner startade",
      systemStatsSessionsActive: "Sessioner aktiva",
      systemStatsSessionsEnded: "Sessioner avslutade",
      systemStatsLatestActivity: "Senaste aktivitet",
      adminLogsTitle: "Adminloggar",
      adminLogsStatusDisconnected: "Ej ansluten",
      adminLogsStatusConnected: "Ansluten",
      adminLogsStatusMissing: "Ange inloggning",
      adminLogsStatusError: "Anslutningsfel",
      adminLogsEmpty: "Inga loggar funna.",
      highScoresTitle: "Topplista",
      highScorePromptTitle: "Spara ditt försök",
      highScorePromptWon: "Sprinten är räddad! Lägg till ditt gamer-tag?",
      highScorePromptLost: "Tuff sprint. Lägg till ditt gamer-tag ändå?",
      highScoreNameLabel: "Gamer-tag",
      highScoreNamePlaceholder: "Skriv ditt namn",
      highScoreSave: "Spara",
      highScoreSkip: "Hoppa över",
      highScoreEmpty: "Inga sparade försök ännu.",
    },
    story: {
      title: "Historia",
      text:
        "Vibekodarna springer lösa på övre plan i Stadshuset.\n" +
        "De har för vana att kasta ner okontrollerad kod till källaren.\n" +
        "Du är Vibe Fixer — spring snabbt, granska snabbare och håll flödet igång innan sprinten tar slut.\n" +
        "Om backloggen växer vaknar kundernas FOMO-demon och sprinten blir till ett mörker.\n\n" +
        "Röj undan blockers för att hålla Product Owner lugn, men se upp för mini-demonen Imp Ediment som teleporterar in och sätter upp nya blockers.\n" +
        "Slå sönder en blocker underifrån, eller hoppa över den om du bryr dig mer om fart än Produktägarens blodtryck.",
    },
    cast: {
      title: "Rollista",
      fixer: {
        name: "Fixaren",
        bio: "Kommunal hjälte, snabb på tangenterna och ännu snabbare på städning.",
        alt: "Fixaren",
      },
      coder: {
        name: "Vibe-kodare",
        bio: "Kaosagent på övre plan som släpper okontrollerad kod där det gör som mest ont.",
        alt: "Vibe-kodare",
      },
      imp: {
        name: "Imp Ediment",
        bio: "Teleportande mini-djävul som ställer blockers i din väg.",
        alt: "Imp Ediment",
      },
      fomo: {
        name: "FOMO-demon",
        bio: "Livnär sig på kvarlämnad kod. Besegra den genom att hålla golvet rent från okontrollerad kod.",
        alt: "FOMO-demon",
      },
      po: {
        name: "Product Owner",
        bio: "Vaktar scope och sinnesro, lyckligast när blockers är noll.",
        alt: "Product Owner",
      },
      root: {
        name: "Root",
        bio: "En osedd kraft som slipar code-fu i skuggorna och vantar pa den perfekta mergningen.",
        alt: "Root",
      },
    },
    credits: {
      title: "Tack",
      items: [
        "Kenney New Platformer Pack (CC0) — sprites för karaktärer och tiles.",
        "OpenGameArt CC0-ljud — chiptune-musik och ljudeffekter.",
        "kommun_bg.png bakgrund — CC0 av Magnus.",
        "Egna sprites (PO + bossar) — Magnus.",
        "Medskapare: Magnus & Codex.",
      ],
    },
    highScores: {
      won: (tag) => `Sprinten räddades av ${tag}.`,
      lost: (tag, remaining) =>
        `${tag} försökte rädda sprinten men lämnade ${remaining} okontrollerad${remaining === 1 ? "" : "e"} kodblock kvar.`,
    },
    hud: {
      unchecked: "Okontrollerad kod",
      blockers: "Blockers",
      sound: "Ljud",
      on: "På",
      off: "Av",
      sprintEndsIn: "Sprinten slutar om",
      gameOver: "Spelet är slut",
      reload: "Ladda om sidan för att försöka igen",
    },
    overlays: {
      pressStart: "Tryck Mellanslag för att starta",
      startLines: [
        "En vibe-kodare har tagit över kommunens övervåning",
        "och släpper ner färsk okontrollerad kod i källaren.",
        "Du är Vibe Fixer —> samla så mycket du kan och släng i Code Review Bin.",
        "Skynda: sprinten slutar om 60 sekunder, som de längtande kunderna krävde.",
        "Tryck M för att slå av/på musiken.",
      ],
      fomoGameOver: "SPELET ÄR SLUT",
      fomoTitle: "FOMO-DEMONEN RASAR",
      fomoLine: "Okontrollerad kod finns kvar. Demonen rasar.",
    },
    toast: {
      secondCoderWarning: "Aj då, kunden har hyrt in en till vibe-kodare. Försök hänga med!",
      impWarning: "Åh nej, Imp Ediment är ute och placerar blockers, akta dig!",
      rateLimit: "For manga handlingar samtidigt - sakta ner lite.",
      cAllergy: "Du anvande C. Vibe-kodarna ar allergiska och saktar ner!",
    },
    gameOver: {
      defeated: "FOMO-demonen besegrad! Koden är ren.",
      enraged: "FOMO-demonen rasar! Okontrollerad kod finns kvar.",
    },
    log: {
      brokeBlockers: (count) => `Krossade ${count} blocker${count === 1 ? "" : "s"}.`,
      deposited: "Lade okontrollerad kod till granskning.",
      coderDrop: (id) => `Vibe-kodare #${id} släppte ny okontrollerad kod.`,
      warningSecond: "Varning: vibe-kodare #2 är på väg in.",
      secondJoined: "Vibe-kodare #2 anslöt till kaoset.",
      coderStunned: (id) => `Vibe-kodare #${id} är paralyserad.`,
      coderRecovered: (id) => `Vibe-kodare #${id} är tillbaka.`,
      poMoodChange: (label) => `PO är nu ${label}.`,
      cAllergy: () => "C-allergi aktiverad: kodarna saktar ner.",
      impAppeared: (count) =>
        `Imp Ediment dök upp: placerar ${count} blocker${count === 1 ? "" : "s"}.`,
      fomoRise: "FOMO-demonen reser sig. Okontrollerad kod göder dess raseri.",
    },
    poMood: {
      happy: "Glad",
      content: "Nöjd",
      sad: "Orolig",
    },
  },
};

function normalizeLanguage(lang) {
  if (!lang) {
    return DEFAULT_LANGUAGE;
  }
  const normalized = String(lang).toLowerCase();
  return LANGUAGES.includes(normalized) ? normalized : DEFAULT_LANGUAGE;
}

function loadLanguage() {
  try {
    return normalizeLanguage(localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    return DEFAULT_LANGUAGE;
  }
}

function saveLanguage(lang) {
  const normalized = normalizeLanguage(lang);
  try {
    localStorage.setItem(STORAGE_KEY, normalized);
  } catch (error) {
    // Ignore storage errors to keep the game usable.
  }
  return normalized;
}

function getStrings(lang) {
  return STRINGS[normalizeLanguage(lang)];
}

export { DEFAULT_LANGUAGE, LANGUAGES, getStrings, loadLanguage, saveLanguage, normalizeLanguage };
