import { createInputState } from "./game/input.js";
import { startGame } from "./game/game-loop.js";
import { preloadAssets } from "./game/assets.js";
import { getStrings, loadLanguage, saveLanguage, LANGUAGES } from "./i18n.js";

async function bootstrap() {
  const gameWrap = document.getElementById("game-wrap");
  const logList = document.getElementById("event-log-list");
  const poImage = document.getElementById("po-status-image");
  const languageSelect = document.getElementById("language-select");
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 683;
  canvas.id = "vibefixer-canvas";
  if (gameWrap) {
    gameWrap.appendChild(canvas);
  } else {
    document.body.appendChild(canvas);
  }

  const input = createInputState();
  preloadAssets();
  const initialLanguage = loadLanguage();
  const strings = getStrings(initialLanguage);
  const gameApi = await startGame(canvas, input, { logList, poImage, strings });

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
      element.textContent = value;
    }
  }

  function setAlt(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
      element.setAttribute("alt", value);
    }
  }

  function applyStrings(nextStrings) {
    if (!nextStrings) {
      return;
    }
    setText("controls-label", nextStrings.ui.controlsLabel);
    setText("controls-text", nextStrings.ui.controlsText);
    setText("language-label", nextStrings.ui.languageLabel);
    setText("game-events-title", nextStrings.ui.gameEventsTitle);
    setText("po-status-title", nextStrings.ui.poStatusTitle);
    setText("story-title", nextStrings.story.title);
    setText("story-text", nextStrings.story.text);
    setText("cast-title", nextStrings.cast.title);
    setText("cast-fixer-name", nextStrings.cast.fixer.name);
    setText("cast-fixer-bio", nextStrings.cast.fixer.bio);
    setAlt("cast-fixer-img", nextStrings.cast.fixer.alt);
    setText("cast-coder-name", nextStrings.cast.coder.name);
    setText("cast-coder-bio", nextStrings.cast.coder.bio);
    setAlt("cast-coder-img", nextStrings.cast.coder.alt);
    setText("cast-imp-name", nextStrings.cast.imp.name);
    setText("cast-imp-bio", nextStrings.cast.imp.bio);
    setAlt("cast-imp-img", nextStrings.cast.imp.alt);
    setText("cast-fomo-name", nextStrings.cast.fomo.name);
    setText("cast-fomo-bio", nextStrings.cast.fomo.bio);
    setAlt("cast-fomo-img", nextStrings.cast.fomo.alt);
    setText("cast-po-name", nextStrings.cast.po.name);
    setText("cast-po-bio", nextStrings.cast.po.bio);
    setAlt("cast-po-img", nextStrings.cast.po.alt);
    setText("credits-title", nextStrings.credits.title);
    setText("credits-kenney", nextStrings.credits.items[0]);
    setText("credits-audio", nextStrings.credits.items[1]);
    setText("credits-bg", nextStrings.credits.items[2]);
    setText("credits-authors", nextStrings.credits.items[3]);
  }

  function updateLanguageSelector(nextStrings) {
    if (!languageSelect || !nextStrings) {
      return;
    }
    const enOption = languageSelect.querySelector("option[value='en']");
    const svOption = languageSelect.querySelector("option[value='sv']");
    if (enOption) {
      enOption.textContent = nextStrings.ui.languageEnglish;
    }
    if (svOption) {
      svOption.textContent = nextStrings.ui.languageSwedish;
    }
  }

  function applyLanguage(lang) {
    const normalized = LANGUAGES.includes(lang) ? lang : LANGUAGES[0];
    const nextStrings = getStrings(normalized);
    applyStrings(nextStrings);
    updateLanguageSelector(nextStrings);
    if (languageSelect) {
      languageSelect.value = normalized;
    }
    if (gameApi && typeof gameApi.setStrings === "function") {
      gameApi.setStrings(nextStrings);
    }
  }

  applyLanguage(initialLanguage);

  if (languageSelect) {
    languageSelect.addEventListener("change", (event) => {
      const selected = event.target.value;
      const normalized = saveLanguage(selected);
      applyLanguage(normalized);
    });
  }
}

window.addEventListener("DOMContentLoaded", bootstrap);
