const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleSessions } = require("./api/sessions");
const { handleSystemStats } = require("./api/system");
const { handleHighScores } = require("./api/high-scores");
const { handleAdminAuth } = require("./api/admin-auth");
const { handleAdminLogs } = require("./api/admin-logs");
const { handleAdminHighScores } = require("./api/admin-high-scores");
const { handleAdminNotices } = require("./api/admin-notices");
const { handleNotices } = require("./api/notices");
const { handleAdminGameSettings } = require("./api/admin-game-settings");
const { SECURITY_POLICY } = require("./security/policy");
const { createRateLimiter } = require("./security/rate-limit");
const { sendError } = require("./security/errors");
const { logSecurityEvent } = require("./security/logger");
const { buildRequestContext } = require("./security/context");
const sessionStore = require("./game/session-store");
const sessionRepo = require("./storage/session-repo");

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const FRONTEND_ROOT = path.resolve(__dirname, "..", "..", "frontend");
const rateLimiter = createRateLimiter({
  windowMs: 60_000,
  max: SECURITY_POLICY.writeRateLimitPerIpPerMinute,
});

const WRITE_ENDPOINTS = new RegExp(
  "^/api/sessions$|^/api/sessions/[^/]+/(deposit|spawn|artifact-status|end)$|^/api/high-scores$"
);

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
  const context = buildRequestContext(req, url);

  applySecurityHeaders(res);

  try {
    if (isRateLimitedWrite(req, url)) {
      const limitResult = rateLimiter.check(context.ip);
      if (!limitResult.allowed) {
        res.setHeader("Retry-After", Math.ceil((limitResult.resetAt - Date.now()) / 1000));
        logSecurityEvent("rate_limit", context, { remaining: limitResult.remaining });
        sendError(res, 429, "Rate limit exceeded");
        return;
      }
    }

    if (url.pathname === "/health") {
      sendJson(res, 200, { status: "ok" });
      return;
    }

    if (await handleSystemStats(req, res, url)) {
      return;
    }

    if (await handleHighScores(req, res, url)) {
      return;
    }

    if (await handleAdminAuth(req, res, url)) {
      return;
    }

    if (await handleAdminLogs(req, res, url)) {
      return;
    }

    if (await handleAdminHighScores(req, res, url)) {
      return;
    }

    if (await handleAdminNotices(req, res, url)) {
      return;
    }

    if (await handleAdminGameSettings(req, res, url)) {
      return;
    }

    if (await handleNotices(req, res, url)) {
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
  } catch (error) {
    logSecurityEvent("server_error", context, { message: "Unhandled server error" });
    sendError(res, 500, "Internal Server Error");
  }
});

function applySecurityHeaders(res) {
  const csp = [
    "default-src 'self'",
    "img-src 'self' data:",
    "media-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
  ].join("; ");
  res.setHeader("Content-Security-Policy", csp);
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

function isRateLimitedWrite(req, url) {
  return req.method === "POST" && WRITE_ENDPOINTS.test(url.pathname);
}

async function serveStatic(requestPath, res) {
  const adminMap = {
    "/admin": "admin.html",
    "/admin/login": "admin-login.html",
    "/admin/logs": "admin-logs.html",
    "/admin/high-scores": "admin-high-scores.html",
    "/admin/notices": "admin-notices.html",
    "/admin/game-settings": "admin-game-settings.html",
  };
  const normalizedPath = adminMap[requestPath] || requestPath.replace(/^\/+/, "");
  const safePath = requestPath === "/" ? "index.html" : normalizedPath;
  const filePath = path.normalize(path.join(FRONTEND_ROOT, safePath));

  if (!filePath.startsWith(FRONTEND_ROOT)) {
    return false;
  }

  try {
    const contentType = getContentType(filePath);
    const data = await fs.promises.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": data.length,
    });
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
  console.log(`VibeFixer server running on port ${PORT} (${NODE_ENV})`);
  if (!process.env.NODE_ENV) {
    console.warn("[startup] NODE_ENV is not set; defaulting to development.");
  } else if (NODE_ENV !== "production") {
    console.warn(`[startup] Warning: NODE_ENV is '${NODE_ENV}', not 'production'.`);
  }
});
