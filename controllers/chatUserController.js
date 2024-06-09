const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const chatUsers = require("../models/user")
const { NODE_ENV, JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const NotFoundError = require("../errors/forbidden-err");
const UnauthorizedError = require("../errors/unauthorized-err");

/**
 * Creates a new chat user.
 * Validates the input data and checks for existing usernames.
 * If the username is unique, hashes the password and creates a new user in the database.
 * Returns the new user's username in the response.
 */

const createChatUser = (req, res, next) => {
    const {username, password} = req.body;
    // Check if username and password are provided
    if (!username || !password) {
        return next(new BadRequestError("Username and Password are required!"))
    }
    // Check if username and password are provided
    return chatUsers.findOne({username})
    .then((user) => {
        if (user) {
            return next(new ConflictError("Username already exist, try again"));
        }
        return bcrypt.hash(password, 10); // Hash the password
    })
    .then((hash) => chatUsers.create({
        username,
        password: hash
    }))
    .then((newUser) => 
    res.send({
        username: newUser.username,
    }),
    )
    .catch((err) => {
        if (err.username === "ValidationError") {
            next(new BadRequestError("Invalid data/username"));
        } else {
            next(err)
        }
    });
};

/**
 * Retrieves the current authenticated user's data.
 * Uses the user ID from the JWT token to find the user in the database.
 * Returns the user data in the response.
 */
const getCurrentChatUsers = (req, res, next) => {
    const userId = req.user._id;

    chatUsers.findById(userId)
        .orFail(() => new NotFoundError("User NOT FOUND :( "))
        .then((user) => res.send({ data: user }))
        .catch(next);
}

/**
 * Authenticates a user and issues a JWT token.
 * Validates the provided username and password.
 * If valid, signs a JWT token and returns it in the response.
 */
const login = (req, res, next) => {
    const {username, password} = req.body;

    return chatUsers.findUserByCredentials(username, password)
    .then((user) => {
        // Generate a JWT (JSON Web Token) for the authenticated user
        const token = jwt.sign(
            { _id: user._id},
             // Use the secret key to sign the token; choose based on the environment
            NODE_ENV === "production" ? JWT_SECRET : JWT_SECRET,
            {
                expiresIn: "7d" // Set the token to expire in 7 days
            },
        );
        res.send({token});
    })
    .catch(() => next(new UnauthorizedError("Incorrect username or password")))
};

module.exports = {
    createChatUser,
    login,
    getCurrentChatUsers,
}