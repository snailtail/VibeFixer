const highScoresRepo = require("../storage/high-score-repo");

const MAX_TAG_LENGTH = 24;

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

function handleHighScores(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/high-scores") {
    const scores = highScoresRepo.listHighScores();
    sendJson(res, 200, { scores });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/high-scores") {
    return collectJson(req).then((body) => {
      if (body && body.__invalidJson) {
        sendJson(res, 400, { error: "Invalid JSON" });
        return true;
      }
      const playerTag = body && typeof body.playerTag === "string" ? body.playerTag.trim() : "";
      const result = body && typeof body.result === "string" ? body.result.toLowerCase() : "";
      const remainingUnchecked = body && Number.isFinite(body.remainingUnchecked) ? body.remainingUnchecked : 0;

      if (!playerTag) {
        sendJson(res, 400, { error: "playerTag is required" });
        return true;
      }
      if (playerTag.length > MAX_TAG_LENGTH) {
        sendJson(res, 400, { error: `playerTag max length is ${MAX_TAG_LENGTH}` });
        return true;
      }
      if (result !== "won" && result !== "lost") {
        sendJson(res, 400, { error: "result must be won or lost" });
        return true;
      }

      const saved = highScoresRepo.saveHighScore({
        playerTag,
        result,
        remainingUnchecked,
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
