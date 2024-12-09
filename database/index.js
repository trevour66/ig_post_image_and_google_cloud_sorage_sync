const sqlite3 = require("sqlite3").verbose();
const { dbPath } = require("./../config");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Database connected successfully.");
  }
});

const is_function_running = (functionName) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT is_running FROM gcp_storage_sync__process_control WHERE function_name = ?`,
      [functionName],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row.is_running === 1 : false); // default to false if not found
        }
      }
    );
  });
};

const updateFunctionStatus = (functionName, is_running) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO gcp_storage_sync__process_control (function_name, is_running) VALUES (?, ?)`,
      [functionName, is_running ? 1 : 0],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(
            `Function "${functionName}" updated to is_running = ${is_running}`
          );
        }
      }
    );
  });
};

module.exports = {
  is_function_running,
  updateFunctionStatus,
};
