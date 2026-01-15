const { buildRequestContext } = require("../security/context");
const { requireAdminSession } = require("../security/admin-session");
const sessionStore = require("../game/session-store");

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function handleAdminActiveSessions(req, res, url) {
  if (!url.pathname.startsWith("/api/admin/sessions/active")) {
    return false;
  }

  const context = buildRequestContext(req, url);
  if (!requireAdminSession(req, res, context)) {
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/sessions/active") {
    const sessions = sessionStore.getActiveSessionSummaries();
    sendJson(res, 200, { sessions });
    return true;
  }

  sendJson(res, 405, { error: "Method not allowed" });
  return true;
}

module.exports = {
  handleAdminActiveSessions,
};
