const mongoose = require("mongoose")

const chatMessagesSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatUser", // Reference to the ChatUser model for the sender of the message
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatUser", // Reference to the ChatUser model for the receiver of the message
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    messageStatus: {
        type: String,
        default: 'sent'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Message", chatMessagesSchema)