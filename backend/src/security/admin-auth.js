const { SECURITY_POLICY } = require("./policy");
const { logSecurityEvent } = require("./logger");

const failures = new Map();

function getFailureState(ip) {
  if (!failures.has(ip)) {
    failures.set(ip, { count: 0, firstFailedAt: 0, blockedUntil: 0 });
  }
  return failures.get(ip);
}

function recordFailure(ip, reason) {
  const now = Date.now();
  const state = getFailureState(ip);
  if (!state.firstFailedAt || now - state.firstFailedAt > SECURITY_POLICY.adminAuthWindowMs) {
    state.count = 0;
    state.firstFailedAt = now;
    state.blockedUntil = 0;
  }
  state.count += 1;
  if (state.count >= SECURITY_POLICY.adminAuthMaxFailures) {
    state.blockedUntil = now + SECURITY_POLICY.adminAuthBlockMs;
    logSecurityEvent("admin_auth_blocked", { ip }, { reason, blockedUntil: state.blockedUntil });
  } else {
    logSecurityEvent("admin_auth_failed", { ip }, { reason, attempts: state.count });
  }
}

function clearFailures(ip) {
  failures.delete(ip);
}

function parseBasicAuth(header) {
  if (!header || !header.startsWith("Basic ")) {
    return null;
  }
  const encoded = header.slice(6);
  let decoded = "";
  try {
    decoded = Buffer.from(encoded, "base64").toString("utf8");
  } catch (error) {
    return null;
  }
  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) {
    return null;
  }
  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1),
  };
}

function isAdminConfigured() {
  return Boolean(SECURITY_POLICY.adminUser && SECURITY_POLICY.adminPassword);
}

function isAdminAuthorized(req) {
  if (!isAdminConfigured()) {
    return false;
  }
  const header = req.headers.authorization;
  const credentials = parseBasicAuth(header);
  if (!credentials) {
    return false;
  }
  return (
    credentials.username === SECURITY_POLICY.adminUser &&
    credentials.password === SECURITY_POLICY.adminPassword
  );
}

function verifyAdminCredentials({ username, password, ip } = {}) {
  if (!isAdminConfigured()) {
    return { ok: false, status: 503, error: "Admin access not configured" };
  }
  const state = getFailureState(ip || "unknown");
  if (state.blockedUntil && Date.now() < state.blockedUntil) {
    return { ok: false, status: 429, error: "Too many attempts, try later" };
  }
  if (username !== SECURITY_POLICY.adminUser || password !== SECURITY_POLICY.adminPassword) {
    recordFailure(ip || "unknown", "invalid_credentials");
    return { ok: false, status: 401, error: "Unauthorized" };
  }
  clearFailures(ip || "unknown");
  return { ok: true };
}

function requireAdminAuth(req, res, context = {}) {
  if (!isAdminConfigured()) {
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Admin access not configured" }));
    return false;
  }
  const ip = context.ip || "unknown";
  const state = getFailureState(ip);
  if (state.blockedUntil && Date.now() < state.blockedUntil) {
    res.writeHead(429, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Too many attempts, try later" }));
    return false;
  }
  if (!isAdminAuthorized(req)) {
    recordFailure(ip, "invalid_credentials");
    res.writeHead(401, {
      "Content-Type": "application/json",
      "WWW-Authenticate": "Basic realm=\"VibeFixer Admin\"",
    });
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return false;
  }
  clearFailures(ip);
  return true;
}

module.exports = {
  requireAdminAuth,
  isAdminAuthorized,
  isAdminConfigured,
  verifyAdminCredentials,
};
