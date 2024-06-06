const jwt = require("jsonwebtoken");
const chatUsers = require("../models/user")
const { NODE_ENV, JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const NotFoundError = require("../errors/forbidden-err");
const UnauthorizedError = require("../errors/unauthorized-err");

const createChatUser = (req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return next(new BadRequestError("Username and Password are required!"))
    }

    return chatUsers.findOne({username})
    .then((user) => {
        if (user) {
            return next(new ConflictError("Username already exist, try again"));
        }
        return bcrypt.hash(password, 10);
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

const getCurrentChatUsers = (req, res, next) => {
    const userId = req.user._id;

    chatUsers.findById(userId)
        .orFail(() => new NotFoundError("User NOT FOUND :( "))
        .then((user) => res.send({ data: user }))
        .catch(next);
}

const login = (req, res, next) => {
    const {username, password} = req.body;

    return chatUsers.findUserByCredentials(username, password)
    .then((user) => {
        const token = jwt.sign(
            { _id: user._id},
            NODE_ENV === "production" ? JWT_SECRET : JWT_SECRET,
            {
                expiresIn: "7d"
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