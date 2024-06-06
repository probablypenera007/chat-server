const jwt = require("jsonwebtoken");
const chatUsers = require("../models/user")
const { NODE_ENV, JWT_SECRET } = require("../utils/config");

const createChatUser = (req, res, next) => {
    const {username, password} = req.body
}