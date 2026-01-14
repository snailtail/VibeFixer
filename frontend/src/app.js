import { createInputState } from "./game/input.js";
import { startGame } from "./game/game-loop.js";
import { preloadAssets } from "./game/assets.js";
import { getStrings, loadLanguage, saveLanguage, LANGUAGES } from "./i18n.js";

async function bootstrap() {
  const gameWrap = document.getElementById("game-wrap");
  const logList = document.getElementById("event-log-list");
  const poImage = document.getElementById("po-status-image");
  const languageSelect = document.getElementById("language-select");
  const sessionStats = {
    active: document.getElementById("session-stats-active"),
    started: document.getElementById("session-stats-started"),
    ended: document.getElementById("session-stats-ended"),
    stale: document.getElementById("session-stats-stale"),
    won: document.getElementById("session-stats-won"),
    lost: document.getElementById("session-stats-lost"),
    abandoned: document.getElementById("session-stats-abandoned"),
    latest: document.getElementById("session-stats-latest"),
  };
  const systemStats = {
    started: document.getElementById("system-stats-started"),
  };
  const touchControls = {
    left: document.getElementById("touch-left"),
    right: document.getElementById("touch-right"),
    jump: document.getElementById("touch-jump"),
    action: document.getElementById("touch-action"),
  };
  const touchToggleButton = document.getElementById("touch-toggle-button");
  const touchOverlay = document.getElementById("touch-controls");
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

  function setText(id, value, { allowNewlines = false } = {}) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
      if (allowNewlines) {
        element.innerHTML = "";
        const parts = String(value).split(/\n+/);
        parts.forEach((part) => {
          const line = document.createElement("span");
          line.textContent = part;
          element.appendChild(line);
        });
      } else {
        element.textContent = value;
      }
    }
  }

  function setAlt(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
      element.setAttribute("alt", value);
    }
  }

  function setAriaLabel(element, value) {
    if (element && value) {
      element.setAttribute("aria-label", value);
    }
  }

  function applyStrings(nextStrings) {
    if (!nextStrings) {
      return;
    }
    setText("controls-label", nextStrings.ui.controlsLabel);
    setText("controls-text", nextStrings.ui.controlsText, { allowNewlines: true });
    setText("language-label", nextStrings.ui.languageLabel);
    setText("game-events-title", nextStrings.ui.gameEventsTitle);
    setText("po-status-title", nextStrings.ui.poStatusTitle);
    setText("session-stats-title", nextStrings.ui.sessionStatsTitle);
    setText("session-stats-active-label", nextStrings.ui.sessionStatsActive);
    setText("session-stats-started-label", nextStrings.ui.sessionStatsStarted);
    setText("session-stats-ended-label", nextStrings.ui.sessionStatsEnded);
    setText("session-stats-stale-label", nextStrings.ui.sessionStatsStale);
    setText("session-stats-won-label", nextStrings.ui.sessionStatsWon);
    setText("session-stats-lost-label", nextStrings.ui.sessionStatsLost);
    setText("session-stats-abandoned-label", nextStrings.ui.sessionStatsAbandoned);
    setText("session-stats-latest-label", nextStrings.ui.sessionStatsLatest);
    setText("system-stats-title", nextStrings.ui.systemStatsTitle);
    setText("system-stats-started-label", nextStrings.ui.systemStatsStarted);
    setAriaLabel(touchControls.left, nextStrings.ui.touchLeft);
    setAriaLabel(touchControls.right, nextStrings.ui.touchRight);
    setAriaLabel(touchControls.jump, nextStrings.ui.touchJump);
    setAriaLabel(touchControls.action, nextStrings.ui.touchAction);
    if (touchToggleButton) {
      touchToggleButton.textContent = nextStrings.ui.touchToggleShow;
    }
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

  function bindTouchButton(button, key) {
    if (!button) {
      return;
    }
    const setPressed = (value, event) => {
      if (event) {
        event.preventDefault();
      }
      input[key] = value;
    };
    button.addEventListener("pointerdown", (event) => {
      setPressed(true, event);
      button.setPointerCapture(event.pointerId);
    });
    ["pointerup", "pointercancel", "pointerleave", "pointerout"].forEach((type) => {
      button.addEventListener(type, (event) => setPressed(false, event));
    });
  }

  bindTouchButton(touchControls.left, "left");
  bindTouchButton(touchControls.right, "right");
  bindTouchButton(touchControls.jump, "jump");
  bindTouchButton(touchControls.action, "action");

  function updateTouchToggleLabel(nextStrings) {
    if (!touchToggleButton || !touchOverlay || !nextStrings) {
      return;
    }
    const label = touchOverlay.classList.contains("visible")
      ? nextStrings.ui.touchToggleHide
      : nextStrings.ui.touchToggleShow;
    touchToggleButton.textContent = label;
  }

  if (touchToggleButton && touchOverlay) {
    touchToggleButton.addEventListener("click", () => {
      touchOverlay.classList.toggle("visible");
      updateTouchToggleLabel(getStrings(loadLanguage()));
    });
    updateTouchToggleLabel(getStrings(loadLanguage()));
  }

  function updateSessionStats(data) {
    if (!data) {
      return;
    }
    if (sessionStats.active) {
      sessionStats.active.textContent = String(data.activeCount ?? 0);
    }
    if (sessionStats.started) {
      sessionStats.started.textContent = String(data.startedCount ?? 0);
    }
    if (sessionStats.ended) {
      sessionStats.ended.textContent = String(data.endedCount ?? 0);
    }
    if (sessionStats.stale) {
      sessionStats.stale.textContent = String(data.staleEndedCount ?? 0);
    }
    if (sessionStats.won) {
      sessionStats.won.textContent = String(data.wonCount ?? 0);
    }
    if (sessionStats.lost) {
      sessionStats.lost.textContent = String(data.lostCount ?? 0);
    }
    if (sessionStats.abandoned) {
      sessionStats.abandoned.textContent = String(data.abandonedCount ?? 0);
    }
    if (sessionStats.latest) {
      if (data.latestCompletedAt) {
        sessionStats.latest.textContent = new Date(data.latestCompletedAt).toLocaleString();
      } else {
        sessionStats.latest.textContent = "—";
      }
    }
  }

  async function fetchSessionStats() {
    try {
      const response = await fetch("/api/sessions/stats");
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      updateSessionStats(data);
    } catch (error) {
      // Ignore transient failures.
    }
  }

  fetchSessionStats();
  setInterval(fetchSessionStats, 10000);

  function updateSystemStats(data) {
    if (!data) {
      return;
    }
    if (systemStats.started) {
      systemStats.started.textContent = data.startedAt
        ? new Date(data.startedAt).toLocaleString()
        : "—";
    }
  }

  async function fetchSystemStats() {
    try {
      const response = await fetch("/api/system/stats");
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      updateSystemStats(data);
    } catch (error) {
      // Ignore transient failures.
    }
  }

  fetchSystemStats();
  setInterval(fetchSystemStats, 20000);
}

window.addEventListener("DOMContentLoaded", bootstrap);
