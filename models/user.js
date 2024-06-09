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
        select: false, // Exclude password from query results by default for security
    },
    sentMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',// Reference to the Message model for messages sent by the user
      }],
    receivedMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message', // Reference to the Message model for messages received by the user
    }],
});

/**
 * Static method to find a user by credentials.
 * This method checks if a user with the given username exists 
 * and if the provided password matches.
 */
chatUserSchema.statics.findUserByCredentials = function findUserByCredentials(
    username,
    password,
) {
    return this.findOne({username})
    .select("+password") // Explicitly select the password field which is excluded by default
    .then((user) => {
        if (!user) {
            return Promise.reject(new Error("Incorrect username or password"));  
        } 
        
        return bcrypt.compare(password, user.password).then((matched) => {
            if (!matched) {
                return Promise.reject(new Error("Incorrect username or password"));
            }
            return user;
        });
    });
};

module.exports = mongoose.model("ChatUsers", chatUserSchema);