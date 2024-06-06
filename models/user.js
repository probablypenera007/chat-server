const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const chatUserSchema = new mongoose.Schema({
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
    sentMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      }],
      receivedMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      }],
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
    username,
    password,
) {
    return this.findOne({username})
    .select("+password")
    .then((user) => {
        if (!user) {
            return Promise.reject(new Error("Incorrect username or password"));  
        } 
        
        return bcrypt.compare(password, user.paswword).then((matched) => {
            if (!matched) {
                return Promise.reject(new Error("Incorrect username or password"));
            }
            return user;
        });
    });
};

module.exports = mongoose.model("ChatUsers", chatUserSchema);