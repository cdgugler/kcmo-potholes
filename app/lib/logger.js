const winston = require('winston');
const { printf } = winston.format;
const path = require('path');
require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, '../history-%DATE%.log'),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '14d',
});

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [transport],
});

module.exports = {
    logger,
};
