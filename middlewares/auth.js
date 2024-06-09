const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-err");

/**
 * Authentication middleware that checks for a valid JWT token in the request headers.
 * If the token is valid, the payload is attached to the request object 
 * and the next middleware is called.
 * If the token is missing or invalid, an UnauthorizedError is thrown.
 */
const auth = (req, res, next) => {
  const { authorization } = req.headers;
  // Check if authorization header exists and starts with "Bearer "
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization required auth.js");
  }
  // Extract the token from the authorization header
  const token = authorization.replace("Bearer ", "");
  // console.log("Received token:", token);

  let payload;

  try {
    // Verify the token using JWT_SECRET
    payload = jwt.verify(token, JWT_SECRET);
    // console.log("Token payload:", payload);
  } catch (e) {
    // console.error('Token verification failed:', e);
    return next(new UnauthorizedError("Unauthorized Token in auth.js"));
  }
  // Attach the payload to the request object
  req.user = payload;

  return next();
};

module.exports = { auth };
