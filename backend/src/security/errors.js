function sendError(res, statusCode, message) {
  const body = JSON.stringify({ error: message });
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

module.exports = {
  sendError,
};
