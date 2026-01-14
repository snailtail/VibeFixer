const { getDb } = require("./sqlite");

function saveLog({ timestamp, category, severity, eventType, message, details }) {
  const db = getDb();
  db.prepare(
    `
    INSERT INTO logs (timestamp, category, severity, event_type, message, details)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  ).run(
    timestamp,
    category,
    severity,
    eventType,
    message,
    details ? JSON.stringify(details) : null
  );
}

function listLogs({ start, end, category, severity, query, limit }) {
  const db = getDb();
  const clauses = ["timestamp >= ?", "timestamp <= ?"];
  const params = [start, end];

  if (category) {
    clauses.push("category = ?");
    params.push(category);
  }
  if (severity) {
    clauses.push("severity = ?");
    params.push(severity);
  }
  if (query) {
    clauses.push("(message LIKE ? OR details LIKE ? OR event_type LIKE ?)");
    const like = `%${query}%`;
    params.push(like, like, like);
  }

  params.push(limit);

  const sql = `
    SELECT timestamp, category, severity, event_type, message, details
    FROM logs
    WHERE ${clauses.join(" AND ")}
    ORDER BY timestamp DESC
    LIMIT ?
  `;

  return db.prepare(sql).all(...params).map((row) => ({
    timestamp: row.timestamp,
    category: row.category,
    severity: row.severity,
    eventType: row.event_type,
    message: row.message,
    details: row.details ? safeParse(row.details) : null,
  }));
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

module.exports = {
  saveLog,
  listLogs,
};
