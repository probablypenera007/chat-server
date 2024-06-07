const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-err");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization required auth.js");
  }

  const token = authorization.replace("Bearer ", "");
  // console.log("Received token:", token);

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    // console.log("Token payload:", payload);
    
  } catch (e) {
    // console.error('Token verification failed:', e);
    return next(new UnauthorizedError("Unauthorized Token in auth.js"));
  }
  req.user = payload;

  return next();
};

module.exports = { auth };
