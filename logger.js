const winston = require('winston');

const myFormat = winston.format.printf(info => {
  return `${info.timestamp} [${info.level}]: ${info.message}`;
});

module.exports =  winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    myFormat),
  transports: [
    new winston.transports.Console()
  ]
});
