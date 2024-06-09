const errorMessages = require("../utils/errorMessages");
/**
 * NotFoundError class.
 * This class extends the built-in Error class to represent a 404 Not Found error.
 * It uses the error message constant defined in `constants/errors.js`.
 */
class NotFoundError extends Error {
  constructor() {
    super(errorMessages.NotFound);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;