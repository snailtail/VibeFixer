const { SECURITY_POLICY } = require("../security/policy");
const { buildRequestContext } = require("../security/context");
const { requireAdminSession } = require("../security/admin-session");
const { parseJsonBody, optionalNumber, recordValidationFailure } = require("../security/validate");
const { sendError } = require("../security/errors");
const gameSettingsRepo = require("../storage/game-settings-repo");

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function handleAdminGameSettings(req, res, url) {
  if (!url.pathname.startsWith("/api/admin/game-settings")) {
    return false;
  }

  const context = buildRequestContext(req, url);
  if (!requireAdminSession(req, res, context)) {
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/game-settings") {
    const settings = gameSettingsRepo.listSettings();
    sendJson(res, 200, { settings });
    return true;
  }

  if (req.method === "PUT" && url.pathname === "/api/admin/game-settings") {
    return handleUpdate(req, res);
  }

  sendJson(res, 405, { error: "Method not allowed" });
  return true;
}

async function handleUpdate(req, res) {
  const parsed = await parseJsonBody(req, { maxBytes: SECURITY_POLICY.maxRequestBytes });
  if (parsed.error === "payload_too_large") {
    recordValidationFailure("payload_too_large");
    sendError(res, 413, "Payload too large");
    return true;
  }
  if (parsed.error === "invalid_json") {
    recordValidationFailure("invalid_json");
    sendError(res, 400, "Invalid JSON");
    return true;
  }

  const body = parsed.data || {};
  const speedCheck = optionalNumber(body.playerSpeedPercent, { min: 50, max: 150 });
  if (!speedCheck.ok || speedCheck.value === null) {
    recordValidationFailure("invalid_player_speed");
    sendError(res, 400, "playerSpeedPercent must be between 50 and 150");
    return true;
  }

  const saved = gameSettingsRepo.saveSetting("playerSpeedPercent", speedCheck.value);
  sendJson(res, 200, { setting: saved });
  return true;
}

module.exports = {
  handleAdminGameSettings,
};
