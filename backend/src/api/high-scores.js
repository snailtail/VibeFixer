const highScoresRepo = require("../storage/high-score-repo");
const { SECURITY_POLICY } = require("../security/policy");
const { parseJsonBody, requireString, requireEnum, optionalNumber } = require("../security/validate");
const { sendError } = require("../security/errors");
const { logSecurityEvent } = require("../security/logger");
const { buildRequestContext } = require("../security/context");

const MAX_TAG_LENGTH = 24;

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function handleHighScores(req, res, url) {
  const context = buildRequestContext(req, url);

  if (req.method === "GET" && url.pathname === "/api/high-scores") {
    const scores = highScoresRepo.listHighScores();
    sendJson(res, 200, { scores });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/high-scores") {
    return parseJsonBody(req, { maxBytes: SECURITY_POLICY.maxRequestBytes }).then((parsed) => {
      if (parsed.error === "payload_too_large") {
        logSecurityEvent("validation_failed", context, { reason: "payload_too_large" });
        sendError(res, 413, "Payload too large");
        return true;
      }
      if (parsed.error === "invalid_json") {
        logSecurityEvent("validation_failed", context, { reason: "invalid_json" });
        sendError(res, 400, "Invalid JSON");
        return true;
      }
      const body = parsed.data || {};
      const tagCheck = requireString(body.playerTag, { maxLength: MAX_TAG_LENGTH });
      const resultCheck = requireEnum(body.result, ["won", "lost"]);
      const remainingCheck = optionalNumber(body.remainingUnchecked, { min: 0, max: 9999 });

      if (!tagCheck.ok) {
        logSecurityEvent("validation_failed", context, { reason: "invalid_player_tag" });
        sendError(res, 400, "playerTag is required");
        return true;
      }
      if (!resultCheck.ok) {
        logSecurityEvent("validation_failed", context, { reason: "invalid_result" });
        sendError(res, 400, "result must be won or lost");
        return true;
      }
      if (!remainingCheck.ok) {
        logSecurityEvent("validation_failed", context, { reason: "invalid_remaining_unchecked" });
        sendError(res, 400, "remainingUnchecked must be a non-negative number");
        return true;
      }

      const saved = highScoresRepo.saveHighScore({
        playerTag: tagCheck.value,
        result: resultCheck.value,
        remainingUnchecked: remainingCheck.value ?? 0,
      });
      sendJson(res, 201, { score: saved });
      return true;
    });
  }

  return false;
}

module.exports = {
  handleHighScores,
};
