const { generateLevel } = require("./level-generator");
const { validateLevel } = require("./level-validator");
const { SECURITY_POLICY } = require("../security/policy");
const highScoreRepo = require("../storage/high-score-repo");

const sessions = new Map();
let stats = {
  startedCount: 0,
  endedCount: 0,
  staleEndedCount: 0,
  wonCount: 0,
  lostCount: 0,
  abandonedCount: 0,
  latestCompletedAt: null,
};
let repository = null;

const STALE_MULTIPLIER = 2;
const CLEANUP_INTERVAL_MS = 30_000;
const RETENTION_CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
let lastRetentionCleanup = 0;

function setRepository(repo) {
  repository = repo;
}

function initSessionStore() {
  if (!repository) {
    return;
  }
  const loadedStats = repository.loadStats();
  if (loadedStats) {
    stats = { ...stats, ...loadedStats };
  }
  const activeSessions = repository.loadActiveSessions();
  sessions.clear();
  activeSessions.forEach((session) => {
    sessions.set(session.id, session);
  });
}

function createSession({ durationSeconds = 60 } = {}) {
  cleanupStaleSessions();
  const sessionId = `session_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const seed = `${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
  const level = generateLevel({ seed, validateLevel, includeArtifacts: false });
  const startedAtMs = Date.now();

  const session = {
    id: sessionId,
    seed,
    startedAt: new Date(startedAtMs).toISOString(),
    startedAtMs,
    durationSeconds,
    score: 0,
    status: "active",
    remainingArtifactCount: 0,
    artifacts: [],
    terrain: level.terrain,
    trashCan: level.trashCan,
  };

  stats.startedCount += 1;
  sessions.set(sessionId, session);
  if (repository) {
    repository.saveSession(session);
    repository.saveStats(stats);
  }
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
  if (repository) {
    repository.saveSession(updated);
  }
  return updated;
}

function saveSession(session) {
  sessions.set(session.id, session);
  if (repository) {
    repository.saveSession(session);
  }
  return session;
}

function endSession(sessionId, { reason = "ended", result = null } = {}) {
  const session = sessions.get(sessionId);
  if (!session) {
    return null;
  }
  session.status = "ended";
  session.endedAt = new Date().toISOString();
  session.endReason = reason;
  session.result = result;
  sessions.delete(sessionId);
  stats.endedCount += 1;
  if (reason === "stale") {
    stats.staleEndedCount += 1;
    stats.abandonedCount += 1;
  } else if (result === "won") {
    stats.wonCount += 1;
    stats.latestCompletedAt = session.endedAt;
  } else if (result === "lost") {
    stats.lostCount += 1;
    stats.latestCompletedAt = session.endedAt;
  } else {
    stats.abandonedCount += 1;
  }
  if (repository) {
    repository.saveSession(session);
    repository.saveStats(stats);
  }
  return session;
}

function cleanupStaleSessions(nowMs = Date.now()) {
  const staleIds = [];
  sessions.forEach((session, sessionId) => {
    if (session.status !== "active") {
      return;
    }
    const maxAgeMs = session.durationSeconds * STALE_MULTIPLIER * 1000;
    if (nowMs - session.startedAtMs > maxAgeMs) {
      staleIds.push(sessionId);
    }
  });
  staleIds.forEach((sessionId) => endSession(sessionId, { reason: "stale" }));
  if (repository && nowMs - lastRetentionCleanup >= RETENTION_CLEANUP_INTERVAL_MS) {
    const removedSessions = repository.cleanupEndedSessions(SECURITY_POLICY.retentionSessionsDays);
    const removedScores = highScoreRepo.cleanupHighScores(SECURITY_POLICY.retentionHighScoresDays);
    if (removedSessions || removedScores) {
      // Retention cleanup is best-effort; no action needed beyond cleanup.
    }
    lastRetentionCleanup = nowMs;
  }
  return staleIds.length;
}

function getSessionStats() {
  cleanupStaleSessions();
  return {
    activeCount: sessions.size,
    startedCount: stats.startedCount,
    endedCount: stats.endedCount,
    staleEndedCount: stats.staleEndedCount,
    wonCount: stats.wonCount,
    lostCount: stats.lostCount,
    abandonedCount: stats.abandonedCount,
    latestCompletedAt: stats.latestCompletedAt,
  };
}

setInterval(() => {
  cleanupStaleSessions();
}, CLEANUP_INTERVAL_MS).unref();

module.exports = {
  createSession,
  getSession,
  updateSession,
  saveSession,
  endSession,
  cleanupStaleSessions,
  getSessionStats,
  initSessionStore,
  setRepository,
};
