const mongoose = require("mongoose")

const chatMessagesSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatUser",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatUser",
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