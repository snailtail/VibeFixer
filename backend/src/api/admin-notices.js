const crypto = require("crypto");
const { SECURITY_POLICY } = require("../security/policy");
const { buildRequestContext } = require("../security/context");
const { requireAdminSession } = require("../security/admin-session");
const { parseJsonBody, requireString, recordValidationFailure } = require("../security/validate");
const { sendError } = require("../security/errors");
const noticeRepo = require("../storage/admin-notice-repo");

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function parseDate(value) {
  if (!value || typeof value !== "string") {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

function handleAdminNotices(req, res, url) {
  if (!url.pathname.startsWith("/api/admin/notices")) {
    return false;
  }

  const context = buildRequestContext(req, url);
  if (!requireAdminSession(req, res, context)) {
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/notices") {
    const notices = noticeRepo.listNotices();
    sendJson(res, 200, { notices });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/notices") {
    return handleCreate(req, res);
  }

  const match = url.pathname.match(/^\/api\/admin\/notices\/(.+)$/);
  if (!match) {
    sendJson(res, 404, { error: "Not Found" });
    return true;
  }

  const id = match[1];
  if (req.method === "PATCH") {
    return handleUpdate(req, res, id);
  }
  if (req.method === "DELETE") {
    const deleted = noticeRepo.deleteNotice(id);
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

async function handleCreate(req, res) {
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
  const messageCheck = requireString(body.message, { maxLength: 240 });
  if (!messageCheck.ok) {
    recordValidationFailure("invalid_notice_message");
    sendError(res, 400, "message is required");
    return true;
  }
  const validFrom = parseDate(body.validFrom) || new Date().toISOString();
  const validTo = parseDate(body.validTo);
  if (!validTo) {
    recordValidationFailure("invalid_notice_valid_to");
    sendError(res, 400, "validTo is required");
    return true;
  }
  if (new Date(validTo) < new Date(validFrom)) {
    recordValidationFailure("invalid_notice_range");
    sendError(res, 400, "validTo must be after validFrom");
    return true;
  }

  const notice = noticeRepo.createNotice({
    id: crypto.randomUUID(),
    message: messageCheck.value,
    validFrom,
    validTo,
  });
  sendJson(res, 201, { notice });
  return true;
}

async function handleUpdate(req, res, id) {
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
  const messageCheck = requireString(body.message, { maxLength: 240 });
  if (!messageCheck.ok) {
    recordValidationFailure("invalid_notice_message");
    sendError(res, 400, "message is required");
    return true;
  }
  const validFrom = parseDate(body.validFrom);
  const validTo = parseDate(body.validTo);
  if (!validFrom || !validTo) {
    recordValidationFailure("invalid_notice_range");
    sendError(res, 400, "validFrom and validTo are required");
    return true;
  }
  if (new Date(validTo) < new Date(validFrom)) {
    recordValidationFailure("invalid_notice_range");
    sendError(res, 400, "validTo must be after validFrom");
    return true;
  }

  const updated = noticeRepo.updateNotice(id, {
    message: messageCheck.value,
    validFrom,
    validTo,
  });
  if (!updated) {
    sendJson(res, 404, { error: "Not found" });
    return true;
  }
  sendJson(res, 200, { notice: updated });
  return true;
}

module.exports = {
  handleAdminNotices,
};
