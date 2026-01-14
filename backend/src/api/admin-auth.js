const { SECURITY_POLICY } = require("../security/policy");
const { parseJsonBody, requireString, recordValidationFailure } = require("../security/validate");
const { sendError } = require("../security/errors");
const { buildRequestContext } = require("../security/context");
const { verifyAdminCredentials, isAdminConfigured } = require("../security/admin-auth");
const {
  createAdminSession,
  getSessionIdFromRequest,
  deleteAdminSession,
  setAdminSessionCookie,
  clearAdminSessionCookie,
} = require("../security/admin-session");

function sendJson(res, statusCode, payload, headers = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
    ...headers,
  });
  res.end(body);
}

async function handleAdminAuth(req, res, url) {
  if (url.pathname === "/api/admin/login" && req.method === "POST") {
    const context = buildRequestContext(req, url);
    const parsed = await parseJsonBody(req, { maxBytes: SECURITY_POLICY.maxRequestBytes });
    if (parsed.error === "payload_too_large") {
      recordValidationFailure("payload_too_large");
      sendError(res, 413, "Payload too large");
      return true;
    }
    if (parsed.error === "invalid_json") {
      recordValidationFailure("invalid_json");
      sendError(res, 400, "Invalid JSON");
      return true;
    }
    if (!parsed.data) {
      recordValidationFailure("missing_body");
      sendError(res, 400, "Body required");
      return true;
    }
    const usernameCheck = requireString(parsed.data.username, { maxLength: 64 });
    const passwordCheck = requireString(parsed.data.password, { maxLength: 128 });
    if (!usernameCheck.ok || !passwordCheck.ok) {
      recordValidationFailure("invalid_credentials_payload");
      sendError(res, 400, "Username and password are required");
      return true;
    }
    const result = verifyAdminCredentials({
      username: usernameCheck.value,
      password: passwordCheck.value,
      ip: context.ip,
    });
    if (!result.ok) {
      sendJson(res, result.status, { error: result.error });
      return true;
    }
    const session = createAdminSession(context);
    setAdminSessionCookie(res, session.sessionId, session.expiresAt);
    sendJson(res, 200, { expiresAt: session.expiresAt });
    return true;
  }

  if (url.pathname === "/api/admin/logout" && req.method === "POST") {
    if (!isAdminConfigured()) {
      sendJson(res, 503, { error: "Admin access not configured" });
      return true;
    }
    const sessionId = getSessionIdFromRequest(req);
    if (sessionId) {
      deleteAdminSession(sessionId);
    }
    clearAdminSessionCookie(res);
    sendJson(res, 200, { ok: true });
    return true;
  }

  return false;
}

module.exports = {
  handleAdminAuth,
};
