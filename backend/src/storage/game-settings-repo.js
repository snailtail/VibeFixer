const { getDb } = require("./sqlite");

const DEFAULT_SETTINGS = {
  playerSpeedPercent: 100,
};

function getSetting(key) {
  const db = getDb();
  const row = db.prepare("SELECT value FROM game_settings WHERE key = ?").get(key);
  if (!row) {
    return DEFAULT_SETTINGS[key] ?? null;
  }
  const value = Number(row.value);
  return Number.isFinite(value) ? value : DEFAULT_SETTINGS[key] ?? null;
}

function listSettings() {
  return {
    playerSpeedPercent: getSetting("playerSpeedPercent"),
  };
}

function saveSetting(key, value) {
  const db = getDb();
  const updatedAt = new Date().toISOString();
  db.prepare(
    `
    INSERT INTO game_settings (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = excluded.updated_at
  `
  ).run(key, value, updatedAt);
  return { key, value, updatedAt };
}

module.exports = {
  DEFAULT_SETTINGS,
  getSetting,
  listSettings,
  saveSetting,
};
