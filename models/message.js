const mongoose = require("mongoose")

const chatMessages = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatUser",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatUser",
        required: true,
    }
})