import { ensureSession, bindLogout } from "./session.js";

const elements = {
  start: document.getElementById("admin-logs-start"),
  end: document.getElementById("admin-logs-end"),
  category: document.getElementById("admin-logs-category"),
  severity: document.getElementById("admin-logs-severity"),
  query: document.getElementById("admin-logs-query"),
  refresh: document.getElementById("admin-logs-refresh"),
  exportBtn: document.getElementById("admin-logs-export"),
  status: document.getElementById("admin-logs-status"),
  list: document.getElementById("admin-logs-list"),
};

function buildQuery() {
  const params = new URLSearchParams();
  if (elements.start?.value) {
    params.set("start", new Date(elements.start.value).toISOString());
  }
  if (elements.end?.value) {
    params.set("end", new Date(elements.end.value).toISOString());
  }
  if (elements.category?.value) {
    params.set("category", elements.category.value);
  }
  if (elements.severity?.value) {
    params.set("severity", elements.severity.value);
  }
  if (elements.query?.value) {
    params.set("q", elements.query.value.trim());
  }
  return params.toString();
}

function setStatus(message, kind) {
  if (!elements.status) {
    return;
  }
  elements.status.textContent = message;
  elements.status.classList.remove("success", "error");
  if (kind) {
    elements.status.classList.add(kind);
  }
}

function renderLogs(entries) {
  if (!elements.list) {
    return;
  }
  elements.list.innerHTML = "";
  if (!entries || entries.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No logs found.";
    elements.list.appendChild(empty);
    return;
  }
  entries.forEach((entry) => {
    const item = document.createElement("li");
    const timestamp = entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "—";
    item.textContent = `${timestamp} [${entry.category}/${entry.severity}] ${entry.message}`;
    elements.list.appendChild(item);
  });
}

async function fetchLogs() {
  const query = buildQuery();
  const url = query ? `/api/admin/logs?${query}` : "/api/admin/logs";
  setStatus("Loading...");
  const response = await fetch(url, { cache: "no-store" });
  if (response.status === 401) {
    window.location.href = "/admin/login";
    return;
  }
  if (!response.ok) {
    setStatus(`Error ${response.status}`, "error");
    return;
  }
  const data = await response.json();
  renderLogs(data.logs || []);
  setStatus("Connected", "success");
}

async function exportLogs() {
  const query = buildQuery();
  const url = query ? `/api/admin/logs/export?${query}` : "/api/admin/logs/export";
  const response = await fetch(url, { cache: "no-store" });
  if (response.status === 401) {
    window.location.href = "/admin/login";
    return;
  }
  if (!response.ok) {
    setStatus(`Error ${response.status}`, "error");
    return;
  }
  const data = await response.json();
  const blob = new Blob([JSON.stringify(data.logs || [], null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "admin-logs.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

bindLogout();
ensureSession().then((ok) => {
  if (ok) {
    fetchLogs();
  }
});

if (elements.refresh) {
  elements.refresh.addEventListener("click", () => fetchLogs());
}
if (elements.exportBtn) {
  elements.exportBtn.addEventListener("click", () => exportLogs());
}
