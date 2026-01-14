const { SECURITY_POLICY } = require("../security/policy");
const { requireAdminSession } = require("../security/admin-session");
const { buildRequestContext } = require("../security/context");
const logRepo = require("../storage/log-repo");

function sendJson(res, statusCode, payload, headers = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
    ...headers,
  });
  res.end(body);
}

function parseQuery(url) {
  const params = url.searchParams;
  const start = params.get("start");
  const end = params.get("end");
  const category = params.get("category");
  const severity = params.get("severity");
  const query = params.get("q");
  const limitRaw = params.get("limit");
  return { start, end, category, severity, query, limitRaw };
}

function normalizeRange({ start, end }) {
  const now = new Date();
  const endDate = end ? new Date(end) : now;
  const startDate = start
    ? new Date(start)
    : new Date(now.getTime() - SECURITY_POLICY.adminLogViewDays * 24 * 60 * 60 * 1000);
  return {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  };
}

function normalizeLimit(limitRaw) {
  const parsed = Number(limitRaw);
  if (!Number.isFinite(parsed)) {
    return SECURITY_POLICY.adminLogDefaultLimit;
  }
  return Math.min(Math.max(parsed, 1), SECURITY_POLICY.adminLogMaxLimit);
}

function normalizeEnum(value, allowed) {
  if (!value) {
    return null;
  }
  const lower = value.toLowerCase();
  return allowed.includes(lower) ? lower : null;
}

function handleAdminLogs(req, res, url) {
  if (!url.pathname.startsWith("/api/admin/logs")) {
    return false;
  }

  const context = buildRequestContext(req, url);
  if (!requireAdminSession(req, res, context)) {
    return true;
  }

  const { start, end, category, severity, query, limitRaw } = parseQuery(url);
  const range = normalizeRange({ start, end });
  const normalizedCategory = normalizeEnum(category, ["security", "gameplay"]);
  const normalizedSeverity = normalizeEnum(severity, ["info", "low", "medium", "high"]);
  if (category && !normalizedCategory) {
    sendJson(res, 400, { error: "Invalid category" });
    return true;
  }
  if (severity && !normalizedSeverity) {
    sendJson(res, 400, { error: "Invalid severity" });
    return true;
  }
  const limit = normalizeLimit(limitRaw);
  const queryText = query ? String(query).slice(0, 120) : null;

  const logs = logRepo.listLogs({
    start: range.start,
    end: range.end,
    category: normalizedCategory,
    severity: normalizedSeverity,
    query: queryText,
    limit,
  });

  if (url.pathname === "/api/admin/logs/export") {
    sendJson(res, 200, { logs }, {
      "Content-Disposition": "attachment; filename=admin-logs.json",
    });
    return true;
  }

  sendJson(res, 200, {
    logs,
    range,
    limit,
  });
  return true;
}

module.exports = {
  handleAdminLogs,
};
