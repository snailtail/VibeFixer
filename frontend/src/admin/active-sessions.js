import { ensureSession, bindLogout } from "./session.js";

const statusEl = document.getElementById("admin-active-sessions-status");
const listEl = document.getElementById("admin-active-sessions-list");
const REFRESH_INTERVAL_MS = 4000;

function setStatus(message, kind) {
  if (!statusEl) {
    return;
  }
  statusEl.textContent = message;
  statusEl.classList.remove("success", "error");
  if (kind) {
    statusEl.classList.add(kind);
  }
}

function formatElapsed(seconds) {
  if (!Number.isFinite(seconds)) {
    return "—";
  }
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}m ${remainder}s`;
}

function renderSessions(sessions) {
  if (!listEl) {
    return;
  }
  listEl.innerHTML = "";

  if (!sessions.length) {
    const empty = document.createElement("li");
    empty.className = "admin-list-item";
    empty.textContent = "No active sessions.";
    listEl.appendChild(empty);
    setStatus("Up to date", "success");
    return;
  }

  sessions.forEach((session) => {
    const item = document.createElement("li");
    item.className = "admin-list-item";

    const header = document.createElement("div");
    header.className = "admin-session-header";

    const title = document.createElement("h4");
    title.textContent = session.sessionId || "Unknown session";

    const status = document.createElement("span");
    status.className = "admin-session-status";
    status.textContent = session.status || "active";

    header.appendChild(title);
    header.appendChild(status);
    item.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "admin-session-grid";

    const fields = [
      ["Started", session.startedAt ? new Date(session.startedAt).toLocaleString() : "—"],
      ["Elapsed", formatElapsed(session.elapsedSeconds)],
      ["Score", Number.isFinite(session.score) ? String(session.score) : "0"],
      [
        "Remaining",
        Number.isFinite(session.remainingArtifacts) ? String(session.remainingArtifacts) : "0",
      ],
      [
        "Speed",
        Number.isFinite(session.playerSpeedPercent) ? `${session.playerSpeedPercent}%` : "—",
      ],
    ];

    fields.forEach(([label, value]) => {
      const field = document.createElement("div");
      field.className = "admin-session-field";
      const labelEl = document.createElement("span");
      labelEl.textContent = label;
      const valueEl = document.createElement("strong");
      valueEl.textContent = value;
      field.appendChild(labelEl);
      field.appendChild(valueEl);
      grid.appendChild(field);
    });

    item.appendChild(grid);
    listEl.appendChild(item);
  });
  setStatus("Up to date", "success");
}

async function fetchActiveSessions() {
  try {
    const response = await fetch("/api/admin/sessions/active", { cache: "no-store" });
    if (response.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    if (!response.ok) {
      setStatus(`Error ${response.status}`, "error");
      return;
    }
    const data = await response.json();
    renderSessions(data.sessions || []);
  } catch (error) {
    setStatus("Network error", "error");
  }
}

async function init() {
  bindLogout();
  const ok = await ensureSession(statusEl);
  if (!ok) {
    return;
  }
  fetchActiveSessions();
  setInterval(fetchActiveSessions, REFRESH_INTERVAL_MS);
}

init();

export { fetchActiveSessions };
