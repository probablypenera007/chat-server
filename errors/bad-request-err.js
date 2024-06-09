const errorMessages = require("../utils/errorMessages");
/**
 * BadRequestError class.
 * This class extends the built-in Error class to represent a 400 Bad Request error.
 * It uses the error message constant defined in `constants/errors.js`.
 */
class BadRequestError extends Error {
  constructor() {
    super(errorMessages.BadRequest);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;