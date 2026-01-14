function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : "unknown";
}

function buildRequestContext(req, url) {
  return {
    ip: getClientIp(req),
    method: req.method,
    path: url.pathname,
  };
}

module.exports = {
  getClientIp,
  buildRequestContext,
};
