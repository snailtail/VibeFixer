const { SECURITY_POLICY } = require("./policy");

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

function requireAdminAuth(req, res) {
  if (!isAdminConfigured()) {
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Admin access not configured" }));
    return false;
  }
  if (!isAdminAuthorized(req)) {
    res.writeHead(401, {
      "Content-Type": "application/json",
      "WWW-Authenticate": "Basic realm=\"VibeFixer Admin\"",
    });
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return false;
  }
  return true;
}

module.exports = {
  requireAdminAuth,
  isAdminAuthorized,
  isAdminConfigured,
};
