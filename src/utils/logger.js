const winston = require('winston');
const { format, transports } = winston;

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'src/logs/app.log' }),
    new transports.File({ filename: 'src/logs/error.log', level: 'error' }),
  ],
});

module.exports = logger;
