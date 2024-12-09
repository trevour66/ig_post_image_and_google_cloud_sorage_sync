const sqlite3 = require("sqlite3").verbose();
const { dbPath } = require("./../config");

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS gcp_storage_sync__process_control (
      function_name TEXT PRIMARY KEY,
      is_running BOOLEAN
    )
  `);
  //   db.run(`INSERT OR REPLACE INTO function_control (function_name, is_running) VALUES ('myFunction', 1)`);
  //   db.run(`INSERT OR REPLACE INTO function_control (function_name, is_running) VALUES ('otherFunction', 0)`);
});
