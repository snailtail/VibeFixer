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
    uptime: document.getElementById("system-stats-uptime"),
    sessionsStarted: document.getElementById("system-stats-sessions-started"),
    sessionsActive: document.getElementById("system-stats-sessions-active"),
    sessionsEnded: document.getElementById("system-stats-sessions-ended"),
    latestActivity: document.getElementById("system-stats-latest-activity"),
  };
  const noticeContainer = document.getElementById("basement-notices");
  const dismissedNotices = new Set();
  const highScorePrompt = {
    container: document.getElementById("high-score-prompt"),
    title: document.getElementById("high-score-prompt-title"),
    message: document.getElementById("high-score-prompt-message"),
    form: document.getElementById("high-score-form"),
    input: document.getElementById("high-score-name"),
    label: document.getElementById("high-score-name-label"),
    save: document.getElementById("high-score-save"),
    skip: document.getElementById("high-score-skip"),
  };
  const highScoresList = document.getElementById("high-scores-list");
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
  const gameApi = await startGame(canvas, input, {
    logList,
    poImage,
    strings,
    onGameEnd: (payload) => handleGameEnd(payload),
  });

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
    setText("system-stats-uptime-label", nextStrings.ui.systemStatsUptime);
    setText("system-stats-sessions-started-label", nextStrings.ui.systemStatsSessionsStarted);
    setText("system-stats-sessions-active-label", nextStrings.ui.systemStatsSessionsActive);
    setText("system-stats-sessions-ended-label", nextStrings.ui.systemStatsSessionsEnded);
    setText("system-stats-latest-activity-label", nextStrings.ui.systemStatsLatestActivity);
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
    setText("high-scores-title", nextStrings.ui.highScoresTitle);
    if (highScorePrompt.title) {
      highScorePrompt.title.textContent = nextStrings.ui.highScorePromptTitle;
    }
    if (highScorePrompt.label) {
      highScorePrompt.label.textContent = nextStrings.ui.highScoreNameLabel;
    }
    if (highScorePrompt.input) {
      highScorePrompt.input.placeholder = nextStrings.ui.highScoreNamePlaceholder;
    }
    if (highScorePrompt.save) {
      highScorePrompt.save.textContent = nextStrings.ui.highScoreSave;
    }
    if (highScorePrompt.skip) {
      highScorePrompt.skip.textContent = nextStrings.ui.highScoreSkip;
    }
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
    fetchHighScores();
  }

  applyLanguage(initialLanguage);
  loadBasementNotices();

  async function loadBasementNotices() {
    if (!noticeContainer) {
      return;
    }
    try {
      const response = await fetch("/api/notices/active", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      renderBasementNotices(data.notices || []);
    } catch (error) {
      // Silent failure for notices to avoid blocking gameplay.
    }
  }

  function renderBasementNotices(notices) {
    if (!noticeContainer) {
      return;
    }
    noticeContainer.innerHTML = "";
    notices
      .filter((notice) => !dismissedNotices.has(notice.id))
      .slice(0, 3)
      .forEach((notice) => {
        const card = document.createElement("div");
        card.className = "basement-notice";
        const title = document.createElement("h4");
        title.textContent = notice.title || "A message from the basement troll";
        const message = document.createElement("p");
        message.textContent = notice.message || "";
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Dismiss";
        button.addEventListener("click", () => {
          dismissedNotices.add(notice.id);
          card.remove();
        });
        card.appendChild(title);
        card.appendChild(message);
        card.appendChild(button);
        noticeContainer.appendChild(card);
      });
  }

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
    if (systemStats.uptime) {
      systemStats.uptime.textContent =
        typeof data.uptimeSeconds === "number" ? `${data.uptimeSeconds}s` : "—";
    }
    if (systemStats.sessionsStarted) {
      systemStats.sessionsStarted.textContent = String(data.sessionsStarted ?? 0);
    }
    if (systemStats.sessionsActive) {
      systemStats.sessionsActive.textContent = String(data.sessionsActive ?? 0);
    }
    if (systemStats.sessionsEnded) {
      systemStats.sessionsEnded.textContent = String(data.sessionsEnded ?? 0);
    }
    if (systemStats.latestActivity) {
      systemStats.latestActivity.textContent = data.latestActivityAt
        ? new Date(data.latestActivityAt).toLocaleString()
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


  function formatHighScore(entry, nextStrings) {
    const scoreStrings = nextStrings?.highScores || {};
    if (entry.result === "won" && typeof scoreStrings.won === "function") {
      return scoreStrings.won(entry.playerTag);
    }
    if (entry.result === "lost" && typeof scoreStrings.lost === "function") {
      return scoreStrings.lost(entry.playerTag, entry.remainingUnchecked);
    }
    return entry.playerTag;
  }

  function renderHighScores(entries, nextStrings) {
    if (!highScoresList) {
      return;
    }
    highScoresList.innerHTML = "";
    if (!entries || entries.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = nextStrings?.ui?.highScoreEmpty || "No high scores yet.";
      highScoresList.appendChild(empty);
      return;
    }
    entries.forEach((entry) => {
      const item = document.createElement("li");
      const message = document.createElement("div");
      const messageText = formatHighScore(entry, nextStrings);
      const tagIndex = messageText.indexOf(entry.playerTag);
      if (tagIndex >= 0) {
        const before = messageText.slice(0, tagIndex);
        const after = messageText.slice(tagIndex + entry.playerTag.length);
        if (before) {
          message.appendChild(document.createTextNode(before));
        }
        const tagSpan = document.createElement("span");
        tagSpan.className = "score-tag";
        tagSpan.textContent = entry.playerTag;
        message.appendChild(tagSpan);
        if (after) {
          message.appendChild(document.createTextNode(after));
        }
      } else {
        message.textContent = messageText;
      }
      item.appendChild(message);
      if (entry.createdAt) {
        const time = document.createElement("span");
        time.className = "score-time";
        time.textContent = new Date(entry.createdAt).toLocaleString();
        item.appendChild(time);
      }
      highScoresList.appendChild(item);
    });
  }

  async function fetchHighScores() {
    try {
      const response = await fetch("/api/high-scores");
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      renderHighScores(data.scores || [], getStrings(loadLanguage()));
    } catch (error) {
      // Ignore transient failures.
    }
  }

  fetchHighScores();
  setInterval(fetchHighScores, 15000);

  function hideHighScorePrompt() {
    if (highScorePrompt.container) {
      highScorePrompt.container.classList.add("hidden");
    }
  }

  function showHighScorePrompt({ result, remainingUnchecked }) {
    if (!highScorePrompt.container || !highScorePrompt.message || !highScorePrompt.input) {
      return;
    }
    const nextStrings = getStrings(loadLanguage());
    const message = result === "won"
      ? nextStrings.ui.highScorePromptWon
      : nextStrings.ui.highScorePromptLost;
    highScorePrompt.message.textContent = message;
    highScorePrompt.container.dataset.result = result;
    highScorePrompt.container.dataset.remainingUnchecked = String(remainingUnchecked ?? 0);
    highScorePrompt.input.value = "";
    highScorePrompt.container.classList.remove("hidden");
    highScorePrompt.input.focus();
  }

  async function submitHighScore() {
    if (!highScorePrompt.container || !highScorePrompt.input) {
      return;
    }
    const playerTag = highScorePrompt.input.value.trim();
    if (!playerTag) {
      highScorePrompt.input.focus();
      return;
    }
    const result = highScorePrompt.container.dataset.result || "lost";
    const remainingUnchecked = Number(highScorePrompt.container.dataset.remainingUnchecked || 0);
    try {
      const response = await fetch("/api/high-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerTag, result, remainingUnchecked }),
      });
      if (response.ok) {
        hideHighScorePrompt();
        fetchHighScores();
      }
    } catch (error) {
      // Ignore transient failures.
    }
  }

  function handleGameEnd(payload) {
    if (!payload || (payload.result !== "won" && payload.result !== "lost")) {
      return;
    }
    showHighScorePrompt(payload);
  }

  if (highScorePrompt.form) {
    highScorePrompt.form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitHighScore();
    });
  }
  if (highScorePrompt.skip) {
    highScorePrompt.skip.addEventListener("click", () => hideHighScorePrompt());
  }
}

window.addEventListener("DOMContentLoaded", bootstrap);
