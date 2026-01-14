const crypto = require("crypto");
const { getDb } = require("../storage/sqlite");
const { SECURITY_POLICY } = require("./policy");
const { logSecurityEvent } = require("./logger");
const { isAdminConfigured } = require("./admin-auth");

const COOKIE_NAME = SECURITY_POLICY.adminSessionCookieName;
const SESSION_TTL_MS = SECURITY_POLICY.adminSessionTtlMs;

function createAdminSession(context = {}) {
  const db = getDb();
  const sessionId = `admin_${crypto.randomBytes(16).toString("hex")}`;
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  db.prepare(
    `
    INSERT INTO admin_sessions (session_id, created_at, expires_at)
    VALUES (?, ?, ?)
  `
  ).run(sessionId, createdAt, expiresAt);
  logSecurityEvent("admin_session_created", context, { sessionId, expiresAt });
  return { sessionId, expiresAt };
}

function getAdminSession(sessionId) {
  if (!sessionId) {
    return null;
  }
  const db = getDb();
  const row = db
    .prepare("SELECT session_id, created_at, expires_at FROM admin_sessions WHERE session_id = ?")
    .get(sessionId);
  if (!row) {
    return null;
  }
  return {
    sessionId: row.session_id,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  };
}

function deleteAdminSession(sessionId) {
  if (!sessionId) {
    return false;
  }
  const db = getDb();
  const result = db.prepare("DELETE FROM admin_sessions WHERE session_id = ?").run(sessionId);
  return result.changes > 0;
}

function cleanupExpiredSessions(now = new Date()) {
  const db = getDb();
  const result = db
    .prepare("DELETE FROM admin_sessions WHERE expires_at <= ?")
    .run(now.toISOString());
  return result.changes || 0;
}

function parseCookies(header) {
  if (!header) {
    return {};
  }
  return header.split(";").reduce((acc, part) => {
    const trimmed = part.trim();
    if (!trimmed) {
      return acc;
    }
    const [key, ...rest] = trimmed.split("=");
    acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

function getSessionIdFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[COOKIE_NAME] || null;
}

function buildSessionCookie(sessionId, { expiresAt, clear = false } = {}) {
  const maxAge = clear ? 0 : Math.floor(SESSION_TTL_MS / 1000);
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(sessionId || "")}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Strict`,
    `Max-Age=${maxAge}`,
  ];
  if (expiresAt) {
    parts.push(`Expires=${new Date(expiresAt).toUTCString()}`);
  } else if (clear) {
    parts.push(`Expires=${new Date(0).toUTCString()}`);
  }
  if (SECURITY_POLICY.adminSessionSecure) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

function setAdminSessionCookie(res, sessionId, expiresAt) {
  res.setHeader("Set-Cookie", buildSessionCookie(sessionId, { expiresAt }));
}

function clearAdminSessionCookie(res) {
  res.setHeader("Set-Cookie", buildSessionCookie("", { clear: true }));
}

function requireAdminSession(req, res, context = {}) {
  if (!isAdminConfigured()) {
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Admin access not configured" }));
    return null;
  }
  cleanupExpiredSessions();
  const sessionId = getSessionIdFromRequest(req);
  if (!sessionId) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return null;
  }
  const session = getAdminSession(sessionId);
  if (!session) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return null;
  }
  if (new Date(session.expiresAt) <= new Date()) {
    deleteAdminSession(sessionId);
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Session expired" }));
    return null;
  }
  return session;
}

module.exports = {
  createAdminSession,
  getSessionIdFromRequest,
  deleteAdminSession,
  cleanupExpiredSessions,
  requireAdminSession,
  setAdminSessionCookie,
  clearAdminSessionCookie,
};
