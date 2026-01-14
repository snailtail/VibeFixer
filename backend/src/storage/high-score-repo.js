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

module.exports = {
  listHighScores,
  saveHighScore,
};
