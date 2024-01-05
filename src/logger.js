const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Log only if severity level is info or below
  format: winston.format.json(), // Log entries as JSON objects
  transports: [
    new winston.transports.File({
      filename: 'src/logs/app.log',
      level: 'info', // Log only info-level messages
    }),
  ],
});

// If not in production, log to console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
