const fs = require('fs');
const path = require('path');
const winston = require('winston');

const dbFolder = path.join(__dirname, 'database');
const dbPath = path.join(dbFolder, 'process_control.db');

const logFolder = path.join(__dirname, 'logs');
const errlogPath = path.join(logFolder, 'app_err.log');
const infologPath = path.join(logFolder, 'app_info.log');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: errlogPath, level: 'error' }),
    new winston.transports.File({ filename: infologPath }),
  ],
});

module.exports = {
    dbPath,
    logger
}