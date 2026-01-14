const { SECURITY_POLICY } = require("../security/policy");
const { buildRequestContext } = require("../security/context");
const { requireAdminSession } = require("../security/admin-session");
const { parseJsonBody, requireString, optionalNumber, requireEnum, recordValidationFailure } = require("../security/validate");
const { sendError } = require("../security/errors");
const highScoreRepo = require("../storage/high-score-repo");

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function handleAdminHighScores(req, res, url) {
  if (!url.pathname.startsWith("/api/admin/high-scores")) {
    return false;
  }

  const context = buildRequestContext(req, url);
  if (!requireAdminSession(req, res, context)) {
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/high-scores") {
    const limit = Number(url.searchParams.get("limit"));
    const scores = highScoreRepo.listHighScores(Number.isFinite(limit) ? limit : undefined);
    sendJson(res, 200, { scores });
    return true;
  }

  const match = url.pathname.match(/^\/api\/admin\/high-scores\/(\d+)$/);
  if (!match) {
    sendJson(res, 404, { error: "Not Found" });
    return true;
  }

  const id = Number(match[1]);
  if (!Number.isFinite(id)) {
    sendJson(res, 400, { error: "Invalid id" });
    return true;
  }

  if (req.method === "PATCH") {
    return handleUpdate(req, res, id, context);
  }

  if (req.method === "DELETE") {
    const deleted = highScoreRepo.deleteHighScore(id);
    if (!deleted) {
      sendJson(res, 404, { error: "Not found" });
      return true;
    }
    sendJson(res, 200, { ok: true });
    return true;
  }

  sendJson(res, 405, { error: "Method not allowed" });
  return true;
}

async function handleUpdate(req, res, id, context) {
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

  let nextPlayerTag = null;
  if (body.playerTag !== undefined) {
    const tagCheck = requireString(body.playerTag, { maxLength: 40 });
    if (!tagCheck.ok) {
      recordValidationFailure("invalid_player_tag");
      sendError(res, 400, "playerTag is invalid");
      return true;
    }
    nextPlayerTag = tagCheck.value;
  }

  let nextResult = null;
  if (body.result !== undefined) {
    const resultCheck = requireEnum(body.result, ["won", "lost"]);
    if (!resultCheck.ok) {
      recordValidationFailure("invalid_result");
      sendError(res, 400, "result must be won or lost");
      return true;
    }
    nextResult = resultCheck.value;
  }

  let nextRemaining = null;
  if (body.remainingUnchecked !== undefined) {
    const remainingCheck = optionalNumber(body.remainingUnchecked, { min: 0, max: 500 });
    if (!remainingCheck.ok) {
      recordValidationFailure("invalid_remaining");
      sendError(res, 400, "remainingUnchecked is invalid");
      return true;
    }
    nextRemaining = remainingCheck.value;
  }

  if (nextPlayerTag === null && nextResult === null && nextRemaining === null) {
    sendError(res, 400, "No fields to update");
    return true;
  }

  const updated = highScoreRepo.updateHighScore(id, {
    playerTag: nextPlayerTag || undefined,
    result: nextResult || undefined,
    remainingUnchecked: nextRemaining !== null ? nextRemaining : undefined,
  });

  if (!updated) {
    sendJson(res, 404, { error: "Not found" });
    return true;
  }

  sendJson(res, 200, { score: updated });
  return true;
}

module.exports = {
  handleAdminHighScores,
};
