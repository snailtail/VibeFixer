const { buildRequestContext } = require("../security/context");
const { sendDbError } = require("../security/errors");
const noticeRepo = require("../storage/admin-notice-repo");

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function handleNotices(req, res, url) {
  if (req.method !== "GET" || url.pathname !== "/api/notices/active") {
    return false;
  }
  const context = buildRequestContext(req, url);
  try {
    const notices = noticeRepo.listActiveNotices();
    sendJson(res, 200, { notices });
  } catch (error) {
    sendDbError(res, context, error);
  }
  return true;
}

module.exports = {
  handleNotices,
};
