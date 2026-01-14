import { getStrings, loadLanguage } from "./i18n.js";

const adminLogs = {
  title: document.getElementById("admin-logs-title"),
  user: document.getElementById("admin-logs-user"),
  pass: document.getElementById("admin-logs-pass"),
  login: document.getElementById("admin-logs-login"),
  start: document.getElementById("admin-logs-start"),
  end: document.getElementById("admin-logs-end"),
  category: document.getElementById("admin-logs-category"),
  severity: document.getElementById("admin-logs-severity"),
  query: document.getElementById("admin-logs-query"),
  refresh: document.getElementById("admin-logs-refresh"),
  export: document.getElementById("admin-logs-export"),
  status: document.getElementById("admin-logs-status"),
  list: document.getElementById("admin-logs-list"),
};

let adminAuthHeader = null;

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value !== undefined) {
    element.textContent = value;
  }
}

function applyStrings(strings) {
  setText("admin-logs-title", strings.ui.adminLogsTitle);
  setText("admin-logs-status", strings.ui.adminLogsStatusDisconnected);
}

function buildAdminQuery() {
  const params = new URLSearchParams();
  if (adminLogs.start && adminLogs.start.value) {
    params.set("start", new Date(adminLogs.start.value).toISOString());
  }
  if (adminLogs.end && adminLogs.end.value) {
    params.set("end", new Date(adminLogs.end.value).toISOString());
  }
  if (adminLogs.category && adminLogs.category.value) {
    params.set("category", adminLogs.category.value);
  }
  if (adminLogs.severity && adminLogs.severity.value) {
    params.set("severity", adminLogs.severity.value);
  }
  if (adminLogs.query && adminLogs.query.value) {
    params.set("q", adminLogs.query.value);
  }
  return params.toString();
}

function renderAdminLogs(entries) {
  if (!adminLogs.list) {
    return;
  }
  adminLogs.list.innerHTML = "";
  if (!entries || entries.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = getStrings(loadLanguage()).ui.adminLogsEmpty;
    adminLogs.list.appendChild(empty);
    return;
  }
  entries.forEach((entry) => {
    const item = document.createElement("li");
    const timestamp = entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "—";
    item.textContent = `${timestamp} [${entry.category}/${entry.severity}] ${entry.message}`;
    adminLogs.list.appendChild(item);
  });
}

async function fetchAdminLogs() {
  if (!adminAuthHeader) {
    return;
  }
  const query = buildAdminQuery();
  const url = query ? `/api/admin/logs?${query}` : "/api/admin/logs";
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: adminAuthHeader,
      },
    });
    if (!response.ok) {
      if (adminLogs.status) {
        adminLogs.status.textContent = `${response.status} ${response.statusText}`;
      }
      return;
    }
    const data = await response.json();
    renderAdminLogs(data.logs || []);
    if (adminLogs.status) {
      adminLogs.status.textContent = getStrings(loadLanguage()).ui.adminLogsStatusConnected;
    }
  } catch (error) {
    if (adminLogs.status) {
      adminLogs.status.textContent = getStrings(loadLanguage()).ui.adminLogsStatusError;
    }
  }
}

async function exportAdminLogs() {
  if (!adminAuthHeader) {
    return;
  }
  const query = buildAdminQuery();
  const url = query ? `/api/admin/logs/export?${query}` : "/api/admin/logs/export";
  const response = await fetch(url, {
    headers: { Authorization: adminAuthHeader },
  });
  if (!response.ok) {
    if (adminLogs.status) {
      adminLogs.status.textContent = `${response.status} ${response.statusText}`;
    }
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

if (adminLogs.login) {
  adminLogs.login.addEventListener("click", () => {
    const username = adminLogs.user ? adminLogs.user.value.trim() : "";
    const password = adminLogs.pass ? adminLogs.pass.value : "";
    if (!username || !password) {
      if (adminLogs.status) {
        adminLogs.status.textContent = getStrings(loadLanguage()).ui.adminLogsStatusMissing;
      }
      return;
    }
    adminAuthHeader = `Basic ${btoa(`${username}:${password}`)}`;
    fetchAdminLogs();
  });
}
if (adminLogs.refresh) {
  adminLogs.refresh.addEventListener("click", () => {
    fetchAdminLogs();
  });
}
if (adminLogs.export) {
  adminLogs.export.addEventListener("click", () => {
    exportAdminLogs();
  });
}

applyStrings(getStrings(loadLanguage()));
