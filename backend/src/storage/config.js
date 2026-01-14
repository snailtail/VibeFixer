const path = require("path");
const fs = require("fs");

const defaultDbPath = path.resolve(__dirname, "..", "..", "..", ".data", "vibefixer.sqlite");
const dbPath = process.env.VIBEFIXER_DB_PATH || defaultDbPath;
const SCHEMA_VERSION = 1;

function ensureDataDir() {
  const dir = path.dirname(dbPath);
  fs.mkdirSync(dir, { recursive: true });
}

module.exports = {
  dbPath,
  ensureDataDir,
  SCHEMA_VERSION,
};
