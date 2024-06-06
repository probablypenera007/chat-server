const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 2,
        maxLength: 30,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
    username,
    password,
) {
    return this.findOne({username})
    .select("+password")
    .then((user) => {
        
    })
}