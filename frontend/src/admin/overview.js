import { ensureSession, bindLogout } from "./session.js";

const statusEl = document.getElementById("admin-status");
const systemStats = {
  started: document.getElementById("admin-system-stats-started"),
  uptime: document.getElementById("admin-system-stats-uptime"),
  sessionsStarted: document.getElementById("admin-system-stats-sessions-started"),
  sessionsActive: document.getElementById("admin-system-stats-sessions-active"),
  sessionsEnded: document.getElementById("admin-system-stats-sessions-ended"),
  sessionsToday: document.getElementById("admin-system-stats-sessions-today"),
  latestActivity: document.getElementById("admin-system-stats-latest-activity"),
};

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
  if (systemStats.sessionsToday) {
    systemStats.sessionsToday.textContent = String(data.sessionsToday ?? 0);
  }
  if (systemStats.latestActivity) {
    systemStats.latestActivity.textContent = data.latestActivityAt
      ? new Date(data.latestActivityAt).toLocaleString()
      : "—";
  }
}

async function fetchSystemStats() {
  try {
    const response = await fetch("/api/system/stats", { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    updateSystemStats(data);
  } catch (error) {
    // Ignore transient failures.
  }
}

async function init() {
  bindLogout();
  const ok = await ensureSession(statusEl);
  if (!ok) {
    return;
  }
  fetchSystemStats();
  setInterval(fetchSystemStats, 20000);
}

init();
