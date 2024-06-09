const errorMessages = require("../utils/errorMessages");
/**
 * ConflictError class.
 * This class extends the built-in Error class to represent a 409 Conflict error.
 * It uses the error message constant defined in `constants/errors.js`.
 */
class ConflictError extends Error {
  constructor() {
    super(errorMessages.Conflict);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;