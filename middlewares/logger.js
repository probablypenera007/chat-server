const winston = require("winston");
const expressWinston = require("express-winston");

/**
 * Define the message format for the logs.
 * Combines a timestamp and a custom print format that includes:
 * - timestamp: The time the log was created.
 * - level: The log level (ex: info, error).
 * - meta.error?.stack || message: Logs the error stack trace if available, otherwise logs the message.
 */
const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, meta, timestamp }) =>
      `${timestamp} ${level}: ${meta.error?.stack || message}`,
  ),
);

/**
 * Logger middleware for logging all HTTP requests.
 * Uses expressWinston.logger to log requests to both console and file.
 * - transports: Specifies where to log the messages.
 * - Console: Logs to the console using the defined message format.
 * - File: Logs to a file named "request.log" in JSON format.
 */
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "request.log",
      format: winston.format.json(),
    }),
  ],
});

/**
 * Logger middleware for logging all HTTP errors.
 * Uses expressWinston.errorLogger to log errors to both console and file.
 * - `transports`: Specifies where to log the messages.
 *   - `Console`: Logs to the console using the defined message format.
 *   - `File`: Logs to a file named "error.log" in JSON format.
 */
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "error.log",
      format: winston.format.json(),
    }),
  ],
});

module.exports = {
  requestLogger,
  errorLogger,
};
