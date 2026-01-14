const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleSessions } = require("./api/sessions");
const { handleSystemStats } = require("./api/system");
const { handleHighScores } = require("./api/high-scores");
const sessionStore = require("./game/session-store");
const sessionRepo = require("./storage/session-repo");

const PORT = process.env.PORT || 3000;
const FRONTEND_ROOT = path.resolve(__dirname, "..", "..", "frontend");

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

sessionStore.setRepository(sessionRepo);
sessionStore.initSessionStore();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/health") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  if (handleSystemStats(req, res, url)) {
    return;
  }

  if (handleHighScores(req, res, url)) {
    return;
  }

  const handled = await handleSessions(req, res, url);
  if (handled) {
    return;
  }

  if (await serveStatic(url.pathname, res)) {
    return;
  }

  sendJson(res, 404, { error: "Not Found" });
});

async function serveStatic(requestPath, res) {
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(FRONTEND_ROOT, safePath));

  if (!filePath.startsWith(FRONTEND_ROOT)) {
    return false;
  }

  try {
    const data = await fs.promises.readFile(filePath);
    const contentType = getContentType(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
    return true;
  } catch (error) {
    return false;
  }
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".png":
      return "image/png";
    case ".ogg":
      return "audio/ogg";
    case ".wav":
      return "audio/wav";
    case ".mp3":
      return "audio/mpeg";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

server.listen(PORT, () => {
  console.log(`VibeFixer server running on port ${PORT}`);
});
