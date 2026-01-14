const {
  createSession,
  getSession,
  saveSession,
  endSession,
  cleanupStaleSessions,
  getSessionStats,
} = require("../game/session-store");
const { SECURITY_POLICY } = require("../security/policy");
const { parseJsonBody, requireString, optionalNumber, requireEnum } = require("../security/validate");
const { sendError } = require("../security/errors");
const { logSecurityEvent } = require("../security/logger");
const { buildRequestContext } = require("../security/context");

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function serializeSession(session) {
  return {
    sessionId: session.id,
    seed: session.seed,
    durationSeconds: session.durationSeconds,
    score: session.score,
    artifacts: session.artifacts.map((artifact) => ({
      id: artifact.id,
      position: artifact.position,
      status: artifact.status,
    })),
    terrain: session.terrain,
    trashCan: session.trashCan,
  };
}

async function handleSessions(req, res, url) {
  cleanupStaleSessions();
  const context = buildRequestContext(req, url);

  if (req.method === "GET" && url.pathname === "/api/sessions/stats") {
    sendJson(res, 200, getSessionStats());
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/sessions") {
    const parsed = await parseJsonBody(req, { maxBytes: SECURITY_POLICY.maxRequestBytes });
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
    const body = parsed.data;

    const durationSeconds = body && body.requestedDurationSeconds
      ? body.requestedDurationSeconds
      : undefined;
    const durationCheck = optionalNumber(durationSeconds, { min: 10, max: 600 });
    if (!durationCheck.ok) {
      logSecurityEvent("validation_failed", context, { reason: "invalid_duration" });
      sendError(res, 400, "requestedDurationSeconds must be between 10 and 600");
      return true;
    }
    const session = createSession({ durationSeconds: durationCheck.value ?? undefined });
    sendJson(res, 201, serializeSession(session));
    return true;
  }

  const pathMatch = url.pathname.match(/^\/api\/sessions\/([^/]+)\/(deposit|end|spawn|artifact-status)$/);
  if (!pathMatch || req.method !== "POST") {
    return false;
  }

  const sessionId = pathMatch[1];
  const action = pathMatch[2];
  const session = getSession(sessionId);

  if (!session) {
    sendJson(res, 404, { error: "Session not found" });
    return true;
  }

  if (action === "end") {
    const parsed = await parseJsonBody(req, { maxBytes: SECURITY_POLICY.maxRequestBytes });
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
    const body = parsed.data;
    if (body && body.result != null) {
      const resultCheck = requireEnum(body.result, ["won", "lost"]);
      if (!resultCheck.ok) {
        logSecurityEvent("validation_failed", context, { reason: "invalid_result" });
        sendError(res, 400, "result must be won or lost");
        return true;
      }
    }
    const normalizedResult = body && body.result ? body.result.toLowerCase() : null;
    const ended = endSession(sessionId, { reason: "ended", result: normalizedResult });
    if (!ended) {
      sendJson(res, 404, { error: "Session not found" });
      return true;
    }
    const deposited = ended.artifacts.filter((artifact) => artifact.status === "deposited");
    sendJson(res, 200, { finalScore: ended.score, artifactsDeposited: deposited.length });
    return true;
  }

  if (action === "spawn") {
    const parsed = await parseJsonBody(req, { maxBytes: SECURITY_POLICY.maxRequestBytes });
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
    const body = parsed.data;
    if (!body || typeof body.x !== "number" || typeof body.y !== "number") {
      logSecurityEvent("validation_failed", context, { reason: "missing_coordinates" });
      sendError(res, 400, "x and y are required");
      return true;
    }

    const artifact = {
      id: `artifact_${session.artifacts.length}_${Date.now()}`,
      position: { x: body.x, y: body.y },
      status: "inAir",
    };
    session.artifacts.push(artifact);
    session.remainingArtifactCount = session.artifacts.filter((item) => item.status !== "deposited").length;
    saveSession(session);
    sendJson(res, 201, { artifact });
    return true;
  }

  if (action === "artifact-status") {
    const parsed = await parseJsonBody(req, { maxBytes: SECURITY_POLICY.maxRequestBytes });
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
    const body = parsed.data;
    const artifactIdCheck = requireString(body && body.artifactId, { maxLength: 80 });
    const statusCheck = requireEnum(body && body.status, ["ground", "inAir", "flying", "deposited", "carried"]);
    if (!artifactIdCheck.ok || !statusCheck.ok) {
      logSecurityEvent("validation_failed", context, { reason: "invalid_artifact_status" });
      sendError(res, 400, "artifactId and valid status are required");
      return true;
    }
    const artifact = session.artifacts.find((item) => item.id === body.artifactId);
    if (!artifact) {
      sendJson(res, 404, { error: "Artifact not found" });
      return true;
    }
    artifact.status = statusCheck.value;
    session.remainingArtifactCount = session.artifacts.filter((item) => item.status !== "deposited").length;
    saveSession(session);
    sendJson(res, 200, { ok: true });
    return true;
  }

  const parsed = await parseJsonBody(req, { maxBytes: SECURITY_POLICY.maxRequestBytes });
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
  const body = parsed.data;
  const artifactIdCheck = requireString(body && body.artifactId, { maxLength: 80 });
  if (!artifactIdCheck.ok) {
    logSecurityEvent("validation_failed", context, { reason: "missing_artifact_id" });
    sendError(res, 400, "artifactId is required");
    return true;
  }

  const artifact = session.artifacts.find((item) => item.id === artifactIdCheck.value);
  if (!artifact || artifact.status === "deposited") {
    sendJson(res, 400, { error: "Artifact not available" });
    return true;
  }

  artifact.status = "deposited";
  session.remainingArtifactCount = Math.max(0, session.remainingArtifactCount - 1);
  session.score = session.artifacts.filter((item) => item.status === "ground").length;
  saveSession(session);

  sendJson(res, 200, {
    score: session.score,
    remainingArtifacts: session.remainingArtifactCount,
  });
  return true;
}

module.exports = {
  handleSessions,
};
