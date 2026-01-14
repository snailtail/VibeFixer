const { getDb } = require("./sqlite");

const MAX_RESULTS = 200;

function listHighScores(limit = MAX_RESULTS) {
  const db = getDb();
  const capped = Number.isFinite(limit) ? Math.max(1, Math.min(MAX_RESULTS, limit)) : MAX_RESULTS;
  return db
    .prepare(
      `
      SELECT id, created_at, player_tag, result, remaining_unchecked
      FROM high_scores
      ORDER BY datetime(created_at) DESC, id DESC
      LIMIT ?
    `
    )
    .all(capped)
    .map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      playerTag: row.player_tag,
      result: row.result,
      remainingUnchecked: row.remaining_unchecked,
    }));
}

function saveHighScore({ playerTag, result, remainingUnchecked = 0 }) {
  const db = getDb();
  const createdAt = new Date().toISOString();
  const normalizedResult = result === "won" ? "won" : "lost";
  const normalizedRemaining = Number.isFinite(remainingUnchecked) ? Math.max(0, remainingUnchecked) : 0;
  const stmt = db.prepare(`
    INSERT INTO high_scores (created_at, player_tag, result, remaining_unchecked)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(createdAt, playerTag, normalizedResult, normalizedRemaining);
  return {
    id: info.lastInsertRowid,
    createdAt,
    playerTag,
    result: normalizedResult,
    remainingUnchecked: normalizedRemaining,
  };
}

function getHighScoreById(id) {
  const db = getDb();
  const row = db
    .prepare(
      `
      SELECT id, created_at, player_tag, result, remaining_unchecked
      FROM high_scores
      WHERE id = ?
    `
    )
    .get(id);
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    createdAt: row.created_at,
    playerTag: row.player_tag,
    result: row.result,
    remainingUnchecked: row.remaining_unchecked,
  };
}

function updateHighScore(id, { playerTag, result, remainingUnchecked }) {
  const existing = getHighScoreById(id);
  if (!existing) {
    return null;
  }
  const normalizedResult = result ? (result === "won" ? "won" : "lost") : existing.result;
  const normalizedRemaining = Number.isFinite(remainingUnchecked)
    ? Math.max(0, remainingUnchecked)
    : existing.remainingUnchecked;
  const nextPlayerTag = playerTag ? playerTag : existing.playerTag;
  const db = getDb();
  db.prepare(
    `
    UPDATE high_scores
    SET player_tag = ?, result = ?, remaining_unchecked = ?
    WHERE id = ?
  `
  ).run(nextPlayerTag, normalizedResult, normalizedRemaining, id);
  return {
    ...existing,
    playerTag: nextPlayerTag,
    result: normalizedResult,
    remainingUnchecked: normalizedRemaining,
  };
}

function deleteHighScore(id) {
  const db = getDb();
  const result = db.prepare("DELETE FROM high_scores WHERE id = ?").run(id);
  return result.changes > 0;
}

function cleanupHighScores(retentionDays) {
  if (!retentionDays) {
    return 0;
  }
  const db = getDb();
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();
  const result = db.prepare("DELETE FROM high_scores WHERE created_at < ?").run(cutoff);
  return result.changes || 0;
}

module.exports = {
  listHighScores,
  saveHighScore,
  getHighScoreById,
  updateHighScore,
  deleteHighScore,
  cleanupHighScores,
};
