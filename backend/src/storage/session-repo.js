const { getDb, withTransaction } = require("./sqlite");
const { serialize, deserialize } = require("./serializers");

function loadActiveSessions() {
  const db = getDb();
  const rows = db.prepare("SELECT data FROM sessions WHERE status = 'active'").all();
  return rows
    .map((row) => deserialize(row.data, null))
    .filter((session) => session && session.id);
}

function loadStats() {
  const db = getDb();
  const row = db.prepare("SELECT * FROM session_stats WHERE id = 1").get();
  if (!row) {
    return null;
  }
  return {
    startedCount: row.started_count,
    endedCount: row.ended_count,
    staleEndedCount: row.stale_ended_count,
    wonCount: row.won_count,
    lostCount: row.lost_count,
    abandonedCount: row.abandoned_count,
    latestCompletedAt: row.latest_completed_at,
  };
}

function saveStats(stats) {
  const db = getDb();
  db.prepare(`
    UPDATE session_stats SET
      started_count = ?,
      ended_count = ?,
      stale_ended_count = ?,
      won_count = ?,
      lost_count = ?,
      abandoned_count = ?,
      latest_completed_at = ?
    WHERE id = 1
  `).run(
    stats.startedCount || 0,
    stats.endedCount || 0,
    stats.staleEndedCount || 0,
    stats.wonCount || 0,
    stats.lostCount || 0,
    stats.abandonedCount || 0,
    stats.latestCompletedAt || null
  );
}

function saveSession(session) {
  const db = getDb();
  const data = serialize(session);
  db.prepare(`
    INSERT INTO sessions (id, status, started_at, ended_at, duration_seconds, result, data)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      status = excluded.status,
      started_at = excluded.started_at,
      ended_at = excluded.ended_at,
      duration_seconds = excluded.duration_seconds,
      result = excluded.result,
      data = excluded.data
  `).run(
    session.id,
    session.status,
    session.startedAt,
    session.endedAt || null,
    session.durationSeconds || null,
    session.result || null,
    data
  );
}

function saveManySessions(sessions) {
  if (!sessions.length) {
    return;
  }
  withTransaction(() => {
    sessions.forEach((session) => saveSession(session));
  });
}

function cleanupEndedSessions(retentionDays) {
  if (!retentionDays) {
    return 0;
  }
  const db = getDb();
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();
  const result = db
    .prepare("DELETE FROM sessions WHERE status = 'ended' AND ended_at IS NOT NULL AND ended_at < ?")
    .run(cutoff);
  return result.changes || 0;
}

module.exports = {
  loadActiveSessions,
  loadStats,
  saveStats,
  saveSession,
  saveManySessions,
  cleanupEndedSessions,
};
