const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { dbPath, ensureDataDir } = require("./config");

let db = null;

function getDb() {
  if (!db) {
    db = openDb();
  }
  return db;
}

function openDb() {
  ensureDataDir();
  try {
    const database = new Database(dbPath);
    database.pragma("journal_mode = WAL");
    initSchema(database);
    return database;
  } catch (error) {
    console.warn("[storage] Failed to open database, recreating:", error.message);
    backupCorruptDb();
    const database = new Database(dbPath);
    database.pragma("journal_mode = WAL");
    initSchema(database);
    return database;
  }
}

function initSchema(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      duration_seconds INTEGER,
      result TEXT,
      data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS session_stats (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      started_count INTEGER NOT NULL,
      ended_count INTEGER NOT NULL,
      stale_ended_count INTEGER NOT NULL,
      won_count INTEGER NOT NULL,
      lost_count INTEGER NOT NULL,
      abandoned_count INTEGER NOT NULL,
      latest_completed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS high_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      player_tag TEXT NOT NULL,
      result TEXT NOT NULL,
      remaining_unchecked INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY
    );
  `);

  const row = database.prepare("SELECT id FROM session_stats WHERE id = 1").get();
  if (!row) {
    database.prepare(`
      INSERT INTO session_stats (
        id, started_count, ended_count, stale_ended_count,
        won_count, lost_count, abandoned_count, latest_completed_at
      ) VALUES (1, 0, 0, 0, 0, 0, 0, NULL)
    `).run();
  }

  const versionRow = database.prepare("SELECT version FROM schema_version LIMIT 1").get();
  if (!versionRow) {
    database.prepare("INSERT INTO schema_version (version) VALUES (1)").run();
  }
}

function backupCorruptDb() {
  if (!fs.existsSync(dbPath)) {
    return;
  }
  const dir = path.dirname(dbPath);
  const base = path.basename(dbPath, path.extname(dbPath));
  const ext = path.extname(dbPath) || ".sqlite";
  const backupPath = path.join(dir, `${base}.corrupt-${Date.now()}${ext}`);
  try {
    fs.renameSync(dbPath, backupPath);
  } catch (error) {
    console.warn("[storage] Failed to backup corrupt database:", error.message);
  }
}

function withTransaction(fn) {
  const database = getDb();
  const wrapped = database.transaction(fn);
  return wrapped();
}

module.exports = {
  getDb,
  withTransaction,
};
