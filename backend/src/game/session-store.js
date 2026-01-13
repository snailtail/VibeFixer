const { generateLevel } = require("./level-generator");
const { validateLevel } = require("./level-validator");

const sessions = new Map();

function createSession({ durationSeconds = 60 } = {}) {
  const sessionId = `session_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const seed = `${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
  const level = generateLevel({ seed, validateLevel, includeArtifacts: false });

  const session = {
    id: sessionId,
    seed,
    startedAt: new Date().toISOString(),
    durationSeconds,
    score: 0,
    status: "active",
    remainingArtifactCount: 0,
    artifacts: [],
    terrain: level.terrain,
    trashCan: level.trashCan,
  };

  sessions.set(sessionId, session);
  return session;
}

function getSession(sessionId) {
  return sessions.get(sessionId);
}

function updateSession(sessionId, updates) {
  const session = sessions.get(sessionId);
  if (!session) {
    return null;
  }

  const updated = { ...session, ...updates };
  sessions.set(sessionId, updated);
  return updated;
}

function saveSession(session) {
  sessions.set(session.id, session);
  return session;
}

module.exports = {
  createSession,
  getSession,
  updateSession,
  saveSession,
};
