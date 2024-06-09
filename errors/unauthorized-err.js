const errorMessages = require("../utils/errorMessages");
/**
 * UnauthorizedError class.
 * This class extends the built-in Error class to represent a 401 Unauthorized error.
 * It uses the error message constant defined in `constants/errors.js`.
 */
class UnauthorizedError extends Error {
  constructor() {
    super(errorMessages.Unauthorized);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;