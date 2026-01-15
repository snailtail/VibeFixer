function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

const { getSystemSessionStats, cleanupStaleSessions } = require("../game/session-store");
const { APP_VERSION } = require("../version");

const systemStartedAtMs = Date.now();
const systemStartedAt = new Date(systemStartedAtMs).toISOString();

function getSystemStats() {
  cleanupStaleSessions();
  const sessionStats = getSystemSessionStats();
  return {
    startedAt: systemStartedAt,
    uptimeSeconds: Math.floor((Date.now() - systemStartedAtMs) / 1000),
    sessionsStarted: sessionStats.startedCount,
    sessionsActive: sessionStats.activeCount,
    sessionsEnded: sessionStats.endedCount,
    sessionsToday: sessionStats.sessionsToday,
    latestActivityAt: sessionStats.latestActivityAt,
    serverVersion: APP_VERSION,
  };
}

function handleSystemStats(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/system/stats") {
    sendJson(res, 200, getSystemStats());
    return true;
  }
  return false;
}

module.exports = {
  handleSystemStats,
  getSystemStats,
};
