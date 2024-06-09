/**
 * Centralized error handling middleware.
 * Sends a response with the error status code and message.
 * If the status code is 500, a generic server error message is sent.
 */
const errorHandler = (err,req, res, next) => {
    // console.error(err);
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
      message: statusCode === 500 ? "An error occurred on the server" : message,
    });
    next();
  };
  
  module.exports = errorHandler;
  