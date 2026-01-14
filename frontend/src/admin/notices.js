import { ensureSession, bindLogout } from "./session.js";

const form = document.getElementById("admin-notice-form");
const messageInput = document.getElementById("admin-notice-message");
const fromInput = document.getElementById("admin-notice-from");
const toInput = document.getElementById("admin-notice-to");
const statusEl = document.getElementById("admin-notice-status");
const listEl = document.getElementById("admin-notices-list");

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

function toLocalInputValue(date) {
  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

async function loadNotices() {
  const response = await fetch("/api/admin/notices", { cache: "no-store" });
  if (response.status === 401) {
    window.location.href = "/admin/login";
    return;
  }
  if (!response.ok) {
    setStatus(`Error ${response.status}`, "error");
    return;
  }
  const data = await response.json();
  renderNotices(data.notices || []);
}

function renderNotices(notices) {
  if (!listEl) {
    return;
  }
  listEl.innerHTML = "";
  if (!notices.length) {
    const empty = document.createElement("li");
    empty.textContent = "No notices yet.";
    listEl.appendChild(empty);
    return;
  }

  notices.forEach((notice) => {
    const item = document.createElement("li");
    item.className = "admin-list-item";
    const header = document.createElement("h4");
    header.textContent = notice.title || "A message from the basement troll";
    item.appendChild(header);

    const meta = document.createElement("small");
    meta.textContent = `Valid: ${new Date(notice.validFrom).toLocaleString()} → ${new Date(
      notice.validTo
    ).toLocaleString()}`;
    item.appendChild(meta);

    const grid = document.createElement("div");
    grid.className = "admin-grid";

    const messageField = document.createElement("label");
    messageField.className = "admin-field";
    const messageLabel = document.createElement("span");
    messageLabel.textContent = "Message";
    const messageArea = document.createElement("textarea");
    messageArea.value = notice.message || "";
    messageField.appendChild(messageLabel);
    messageField.appendChild(messageArea);

    const fromField = document.createElement("label");
    fromField.className = "admin-field";
    const fromLabel = document.createElement("span");
    fromLabel.textContent = "Valid From";
    const fromInputItem = document.createElement("input");
    fromInputItem.type = "datetime-local";
    fromInputItem.value = toLocalInputValue(new Date(notice.validFrom));
    fromField.appendChild(fromLabel);
    fromField.appendChild(fromInputItem);

    const toField = document.createElement("label");
    toField.className = "admin-field";
    const toLabel = document.createElement("span");
    toLabel.textContent = "Valid To";
    const toInputItem = document.createElement("input");
    toInputItem.type = "datetime-local";
    toInputItem.value = toLocalInputValue(new Date(notice.validTo));
    toField.appendChild(toLabel);
    toField.appendChild(toInputItem);

    grid.appendChild(messageField);
    grid.appendChild(fromField);
    grid.appendChild(toField);
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
        message: messageArea.value.trim(),
        validFrom: new Date(fromInputItem.value).toISOString(),
        validTo: new Date(toInputItem.value).toISOString(),
      };
      const response = await fetch(`/api/admin/notices/${notice.id}`, {
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
      const response = await fetch(`/api/admin/notices/${notice.id}`, { method: "DELETE" });
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

function setDefaultTimes() {
  const now = new Date();
  const defaultTo = new Date(now.getTime() + 60 * 60 * 1000);
  if (fromInput) {
    fromInput.value = toLocalInputValue(now);
  }
  if (toInput) {
    toInput.value = toLocalInputValue(defaultTo);
  }
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("Saving...");
    const payload = {
      message: messageInput?.value.trim() || "",
      validFrom: new Date(fromInput.value).toISOString(),
      validTo: new Date(toInput.value).toISOString(),
    };
    const response = await fetch("/api/admin/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
    if (messageInput) {
      messageInput.value = "";
    }
    setDefaultTimes();
    loadNotices();
  });
}

bindLogout();
setDefaultTimes();
ensureSession().then((ok) => {
  if (ok) {
    loadNotices();
  }
});
