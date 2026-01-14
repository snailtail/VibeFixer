function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

const systemStartedAt = new Date().toISOString();

function getSystemStats() {
  return {
    startedAt: systemStartedAt,
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
