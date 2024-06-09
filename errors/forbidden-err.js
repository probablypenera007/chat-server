const errorMessages = require("../utils/errorMessages");
/**
 * ForbiddenError class.
 * This class extends the built-in Error class to represent a 403 Forbidden error.
 * It uses the error message constant defined in `constants/errors.js`.
 */
class NotFoundError extends Error {
  constructor() {
    super(errorMessages.NotFound);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;