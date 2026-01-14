import { ensureSession, bindLogout } from "./session.js";

const listEl = document.getElementById("admin-high-scores-list");
const statusEl = document.getElementById("admin-high-scores-status");

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

function createInput(label, value) {
  const wrapper = document.createElement("label");
  wrapper.className = "admin-field";
  const span = document.createElement("span");
  span.textContent = label;
  const input = document.createElement("input");
  input.type = "text";
  input.value = value ?? "";
  wrapper.appendChild(span);
  wrapper.appendChild(input);
  return { wrapper, input };
}

function createSelect(label, value) {
  const wrapper = document.createElement("label");
  wrapper.className = "admin-field";
  const span = document.createElement("span");
  span.textContent = label;
  const select = document.createElement("select");
  ["won", "lost"].forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue;
    select.appendChild(option);
  });
  select.value = value;
  wrapper.appendChild(span);
  wrapper.appendChild(select);
  return { wrapper, select };
}

function createNumberInput(label, value) {
  const wrapper = document.createElement("label");
  wrapper.className = "admin-field";
  const span = document.createElement("span");
  span.textContent = label;
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.max = "500";
  input.value = Number.isFinite(value) ? String(value) : "0";
  wrapper.appendChild(span);
  wrapper.appendChild(input);
  return { wrapper, input };
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
  renderScores(data.scores || []);
  setStatus("Loaded", "success");
}

function renderScores(scores) {
  if (!listEl) {
    return;
  }
  listEl.innerHTML = "";
  if (!scores.length) {
    const empty = document.createElement("li");
    empty.textContent = "No high scores yet.";
    listEl.appendChild(empty);
    return;
  }

  scores.forEach((score) => {
    const item = document.createElement("li");
    item.className = "admin-list-item";
    const header = document.createElement("h4");
    header.textContent = `Entry #${score.id}`;
    item.appendChild(header);

    const meta = document.createElement("small");
    meta.textContent = `Created: ${new Date(score.createdAt).toLocaleString()}`;
    item.appendChild(meta);

    const grid = document.createElement("div");
    grid.className = "admin-grid";

    const tagField = createInput("Player Tag", score.playerTag);
    const resultField = createSelect("Result", score.result);
    const remainingField = createNumberInput("Remaining Unchecked", score.remainingUnchecked);

    grid.appendChild(tagField.wrapper);
    grid.appendChild(resultField.wrapper);
    grid.appendChild(remainingField.wrapper);
    item.appendChild(grid);

    const actions = document.createElement("div");
    actions.className = "admin-actions";
    const save = document.createElement("button");
    save.textContent = "Save";
    const remove = document.createElement("button");
    remove.textContent = "Delete";
    const rowStatus = document.createElement("span");
    rowStatus.className = "admin-status";

    save.addEventListener("click", async () => {
      rowStatus.textContent = "Saving...";
      const payload = {
        playerTag: tagField.input.value.trim(),
        result: resultField.select.value,
        remainingUnchecked: Number(remainingField.input.value),
      };
      const response = await fetch(`/api/admin/high-scores/${score.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!response.ok) {
        rowStatus.textContent = `Error ${response.status}`;
        rowStatus.classList.add("error");
        return;
      }
      rowStatus.textContent = "Saved";
      rowStatus.classList.add("success");
    });

    remove.addEventListener("click", async () => {
      const response = await fetch(`/api/admin/high-scores/${score.id}`, { method: "DELETE" });
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!response.ok) {
        rowStatus.textContent = `Error ${response.status}`;
        rowStatus.classList.add("error");
        return;
      }
      item.remove();
      rowStatus.textContent = "Deleted";
      rowStatus.classList.add("success");
    });

    actions.appendChild(save);
    actions.appendChild(remove);
    actions.appendChild(rowStatus);
    item.appendChild(actions);

    listEl.appendChild(item);
  });
}

bindLogout();
ensureSession().then((ok) => {
  if (ok) {
    loadScores();
  }
});
