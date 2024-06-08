const Message = require("../models/message");
const chatUser = require("../models/user");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const { encrypt, decrypt } = require("../utils/encryption");

const sendMessage = (io) => async (req, res, next) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;
    const getUser = global.onlineUsers ? global.onlineUsers.get(receiverId) : null;

    if (!receiverId || !message || !senderId) {
      return next(new BadRequestError("Receiver ID, sender ID, and message are required!"));
    }

    const sender = await chatUser.findById(senderId);
    const receiver = await chatUser.findById(receiverId);

    if (!sender || !receiver) {
      return next(new NotFoundError("Sender or receiver not found"));
    }

    const encryptedMessage = encrypt(message);

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: encryptedMessage,
      messageStatus: getUser ? "delivered" : "sent",
    });

    console.log('New message created:', newMessage);

    sender.sentMessages.push(newMessage._id);
    receiver.receivedMessages.push(newMessage._id);

    await sender.save();
    await receiver.save();

    if (getUser) {
      io.to(getUser.socketId).emit('receiveMessage', newMessage);
    }

    res.send({ message: newMessage });
  } catch (err) {
    console.error('Error creating message:', err);
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: from, receiver: to },
        { sender: to, receiver: from },
      ],
    }).sort({ createdAt: "asc" });

    const decryptedMessages = messages.map((msg) => {
      try {
        const decryptedMessage = decrypt(msg.message);
        return {
          ...msg.toObject(),
          message: decryptedMessage,
        };
      } catch (err) {
        console.error('Decryption error:', err);
        return {
          ...msg.toObject(),
          message: 'Decryption failed',
        };
      }
    });

    res.json({ messages: decryptedMessages });
  } catch (err) {
    // console.error('Error fetching messages:', err);
    // res.status(500).json({ message: "An error occurred on the server", error: err.message });
    next(err);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return next(new NotFoundError("Message not found"));
    }

    if (message.sender.toString() !== userId.toString()) {
      return next(new BadRequestError("You can only delete your own messages"));
    }

    await Message.deleteOne({ _id: messageId });

    const sender = await chatUser.findById(message.sender);
    const receiver = await chatUser.findById(message.receiver);

    sender.sentMessages.pull(messageId);
    receiver.receivedMessages.pull(messageId);

    await sender.save();
    await receiver.save();

    // console.log('Message deleted:', messageId);

    res.send({ message: "Message deleted successfully" });

  } catch (err) {
    next(err)
  }
}

module.exports = {
  sendMessage,
  getMessages,
  deleteMessage
};
