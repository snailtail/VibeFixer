import { ensureSession, bindLogout } from "./session.js";

const slider = document.getElementById("admin-player-speed");
const valueEl = document.getElementById("admin-player-speed-value");
const statusEl = document.getElementById("admin-game-settings-status");
const saveBtn = document.getElementById("admin-player-speed-save");

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

function updateValueLabel() {
  if (valueEl && slider) {
    valueEl.textContent = `${slider.value}%`;
  }
}

async function loadSettings() {
  const response = await fetch("/api/admin/game-settings", { cache: "no-store" });
  if (response.status === 401) {
    window.location.href = "/admin/login";
    return;
  }
  if (!response.ok) {
    setStatus(`Error ${response.status}`, "error");
    return;
  }
  const data = await response.json();
  const speed = data.settings?.playerSpeedPercent ?? 100;
  if (slider) {
    slider.value = String(speed);
  }
  updateValueLabel();
  setStatus("Loaded", "success");
}

async function saveSettings() {
  if (!slider) {
    return;
  }
  setStatus("Saving...");
  const response = await fetch("/api/admin/game-settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerSpeedPercent: Number(slider.value) }),
  });
  if (response.status === 401) {
    window.location.href = "/admin/login";
    return;
  }
  if (!response.ok) {
    setStatus(`Error ${response.status}`, "error");
    return;
  }
  setStatus("Saved", "success");
}

bindLogout();
ensureSession().then((ok) => {
  if (ok) {
    loadSettings();
  }
});

if (slider) {
  slider.addEventListener("input", updateValueLabel);
}
if (saveBtn) {
  saveBtn.addEventListener("click", () => saveSettings());
}
