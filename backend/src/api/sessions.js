const { createSession, getSession, saveSession } = require("../game/session-store");

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function collectJson(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      if (!data) {
        resolve(null);
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        resolve({ __invalidJson: true });
      }
    });
  });
}

function serializeSession(session) {
  return {
    sessionId: session.id,
    seed: session.seed,
    durationSeconds: session.durationSeconds,
    score: session.score,
    artifacts: session.artifacts.map((artifact) => ({
      id: artifact.id,
      value: artifact.value,
      position: artifact.position,
      status: artifact.status,
    })),
    terrain: session.terrain,
    trashCan: session.trashCan,
  };
}

async function handleSessions(req, res, url) {
  if (req.method === "POST" && url.pathname === "/api/sessions") {
    const body = await collectJson(req);
    if (body && body.__invalidJson) {
      sendJson(res, 400, { error: "Invalid JSON" });
      return true;
    }

    const durationSeconds = body && body.requestedDurationSeconds
      ? body.requestedDurationSeconds
      : undefined;
    const session = createSession({ durationSeconds });
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
    session.status = "ended";
    const deposited = session.artifacts.filter((artifact) => artifact.status === "deposited");
    saveSession(session);
    sendJson(res, 200, { finalScore: session.score, artifactsDeposited: deposited.length });
    return true;
  }

  if (action === "spawn") {
    const body = await collectJson(req);
    if (!body || body.__invalidJson || typeof body.x !== "number" || typeof body.y !== "number") {
      sendJson(res, 400, { error: "x and y are required" });
      return true;
    }

    const artifact = {
      id: `artifact_${session.artifacts.length}_${Date.now()}`,
      value: Math.floor(Math.random() * 15) + 1,
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
    const body = await collectJson(req);
    if (!body || body.__invalidJson || !body.artifactId || !body.status) {
      sendJson(res, 400, { error: "artifactId and status are required" });
      return true;
    }
    const artifact = session.artifacts.find((item) => item.id === body.artifactId);
    if (!artifact) {
      sendJson(res, 404, { error: "Artifact not found" });
      return true;
    }
    artifact.status = body.status;
    session.remainingArtifactCount = session.artifacts.filter((item) => item.status !== "deposited").length;
    saveSession(session);
    sendJson(res, 200, { ok: true });
    return true;
  }

  const body = await collectJson(req);
  if (!body || body.__invalidJson || !body.artifactId) {
    sendJson(res, 400, { error: "artifactId is required" });
    return true;
  }

  const artifact = session.artifacts.find((item) => item.id === body.artifactId);
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
