const { getDb } = require("./sqlite");

const NOTICE_TITLE = "A message from the basement troll";

function listNotices() {
  const db = getDb();
  return db
    .prepare(
      `
      SELECT id, title, message, valid_from, valid_to, created_at, updated_at
      FROM admin_notices
      ORDER BY datetime(valid_from) DESC, id DESC
    `
    )
    .all()
    .map((row) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      validFrom: row.valid_from,
      validTo: row.valid_to,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
}

function listActiveNotices(now = new Date()) {
  const db = getDb();
  const nowIso = now.toISOString();
  return db
    .prepare(
      `
      SELECT id, title, message, valid_from, valid_to
      FROM admin_notices
      WHERE valid_from <= ? AND valid_to >= ?
      ORDER BY datetime(valid_from) ASC, id ASC
    `
    )
    .all(nowIso, nowIso)
    .map((row) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      validFrom: row.valid_from,
      validTo: row.valid_to,
    }));
}

function createNotice({ id, message, validFrom, validTo }) {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    `
    INSERT INTO admin_notices (id, title, message, valid_from, valid_to, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `
  ).run(id, NOTICE_TITLE, message, validFrom, validTo, now, now);
  return {
    id,
    title: NOTICE_TITLE,
    message,
    validFrom,
    validTo,
    createdAt: now,
    updatedAt: now,
  };
}

function updateNotice(id, { message, validFrom, validTo }) {
  const db = getDb();
  const now = new Date().toISOString();
  const result = db.prepare(
    `
    UPDATE admin_notices
    SET message = ?, valid_from = ?, valid_to = ?, updated_at = ?
    WHERE id = ?
  `
  ).run(message, validFrom, validTo, now, id);
  if (result.changes === 0) {
    return null;
  }
  return {
    id,
    title: NOTICE_TITLE,
    message,
    validFrom,
    validTo,
    updatedAt: now,
  };
}

function deleteNotice(id) {
  const db = getDb();
  const result = db.prepare("DELETE FROM admin_notices WHERE id = ?").run(id);
  return result.changes > 0;
}

module.exports = {
  NOTICE_TITLE,
  listNotices,
  listActiveNotices,
  createNotice,
  updateNotice,
  deleteNotice,
};
