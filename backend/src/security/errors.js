const { logSecurityEvent } = require("./logger");
const { recordFailure } = require("./alerts");

function sendError(res, statusCode, message) {
  const isProd = process.env.NODE_ENV === "production";
  const safeMessage = isProd && statusCode >= 500 ? "Internal Server Error" : message;
  const body = JSON.stringify({ error: safeMessage });
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function sendDbError(res, context, error) {
  logSecurityEvent("db_error", context, { message: error?.message || "unknown" });
  recordFailure("db_error", { message: error?.message || "unknown" });
  sendError(res, 500, "Internal Server Error");
}

module.exports = {
  sendError,
  sendDbError,
};
