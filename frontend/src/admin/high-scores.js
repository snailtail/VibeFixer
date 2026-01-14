import { ensureSession, bindLogout } from "./session.js";

const listEl = document.getElementById("admin-high-scores-list");
const statusEl = document.getElementById("admin-high-scores-status");
const titleEl = document.getElementById("admin-high-score-title");
const createdEl = document.getElementById("admin-high-score-created");
const tagInput = document.getElementById("admin-high-score-player-tag");
const resultSelect = document.getElementById("admin-high-score-result");
const remainingInput = document.getElementById("admin-high-score-remaining");
const saveButton = document.getElementById("admin-high-score-save");
const deleteButton = document.getElementById("admin-high-score-delete");
const editorStatusEl = document.getElementById("admin-high-score-editor-status");

let scores = [];
let selectedId = null;

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

function setEditorStatus(message, kind) {
  if (!editorStatusEl) {
    return;
  }
  editorStatusEl.textContent = message;
  editorStatusEl.classList.remove("success", "error");
  if (kind) {
    editorStatusEl.classList.add(kind);
  }
}

function setEditorEnabled(enabled) {
  if (tagInput) {
    tagInput.disabled = !enabled;
  }
  if (resultSelect) {
    resultSelect.disabled = !enabled;
  }
  if (remainingInput) {
    remainingInput.disabled = !enabled;
  }
  if (saveButton) {
    saveButton.disabled = !enabled;
  }
  if (deleteButton) {
    deleteButton.disabled = !enabled;
  }
}

function updateEditor(score) {
  if (!score) {
    if (titleEl) {
      titleEl.textContent = "Select a high score";
    }
    if (createdEl) {
      createdEl.textContent = "Created: —";
    }
    if (tagInput) {
      tagInput.value = "";
    }
    if (resultSelect) {
      resultSelect.value = "won";
    }
    if (remainingInput) {
      remainingInput.value = "0";
    }
    setEditorStatus("");
    setEditorEnabled(false);
    return;
  }

  if (titleEl) {
    titleEl.textContent = `Entry #${score.id}`;
  }
  if (createdEl) {
    const created = score.createdAt ? new Date(score.createdAt).toLocaleString() : "—";
    createdEl.textContent = `Created: ${created}`;
  }
  if (tagInput) {
    tagInput.value = score.playerTag ?? "";
  }
  if (resultSelect) {
    resultSelect.value = score.result || "won";
  }
  if (remainingInput) {
    remainingInput.value = Number.isFinite(score.remainingUnchecked)
      ? String(score.remainingUnchecked)
      : "0";
  }
  setEditorStatus("");
  setEditorEnabled(true);
}

function renderList() {
  if (!listEl) {
    return;
  }
  listEl.innerHTML = "";
  if (!scores.length) {
    const empty = document.createElement("li");
    empty.textContent = "No high scores yet.";
    listEl.appendChild(empty);
    updateEditor(null);
    return;
  }

  scores.forEach((score) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `#${score.id} ${score.playerTag || "Unknown"} (${score.result})`;
    if (score.id === selectedId) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      selectedId = score.id;
      updateEditor(score);
      renderList();
    });
    item.appendChild(button);
    listEl.appendChild(item);
  });
}

async function loadScores() {
  setStatus("Loading...");
  const response = await fetch("/api/admin/high-scores", { cache: "no-store" });
  if (response.status === 401) {
    window.location.href = "/admin/login";
    return;
  }
  if (!response.ok) {
    setStatus(`Error ${response.status}`, "error");
    return;
  }
  const data = await response.json();
  scores = data.scores || [];
  selectedId = scores.length ? scores[0].id : null;
  updateEditor(scores.find((score) => score.id === selectedId));
  renderList();
  setStatus("Loaded", "success");
}

async function saveSelected() {
  if (!selectedId) {
    return;
  }
  setEditorStatus("Saving...");
  const payload = {
    playerTag: tagInput ? tagInput.value.trim() : "",
    result: resultSelect ? resultSelect.value : "won",
    remainingUnchecked: remainingInput ? Number(remainingInput.value) : 0,
  };
  const response = await fetch(`/api/admin/high-scores/${selectedId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.status === 401) {
    window.location.href = "/admin/login";
    return;
  }
  if (!response.ok) {
    setEditorStatus(`Error ${response.status}`, "error");
    return;
  }
  const data = await response.json();
  const updated = data.score;
  scores = scores.map((score) => (score.id === updated.id ? updated : score));
  updateEditor(updated);
  renderList();
  setEditorStatus("Saved", "success");
}

async function deleteSelected() {
  if (!selectedId) {
    return;
  }
  setEditorStatus("Deleting...");
  const response = await fetch(`/api/admin/high-scores/${selectedId}`, { method: "DELETE" });
  if (response.status === 401) {
    window.location.href = "/admin/login";
    return;
  }
  if (!response.ok) {
    setEditorStatus(`Error ${response.status}`, "error");
    return;
  }
  scores = scores.filter((score) => score.id !== selectedId);
  selectedId = scores.length ? scores[0].id : null;
  updateEditor(scores.find((score) => score.id === selectedId));
  renderList();
  setEditorStatus("Deleted", "success");
}

if (saveButton) {
  saveButton.addEventListener("click", () => {
    saveSelected();
  });
}

if (deleteButton) {
  deleteButton.addEventListener("click", () => {
    deleteSelected();
  });
}

bindLogout();
ensureSession().then((ok) => {
  if (ok) {
    loadScores();
  }
});
