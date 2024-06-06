const Message = require("../models/message");
const chatUser = require("../models/user");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");


// WILL EXECUTE ENCRYPTION HERE

const sendMessage = async (req, res, next) => {
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

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      messageStatus: getUser ? "delivered" : "sent",
    });

    console.log('New message created:', newMessage);

    sender.sentMessages.push(newMessage._id);
    receiver.receivedMessages.push(newMessage._id);

    await sender.save();
    await receiver.save();

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

    const unreadMessages = [];
    messages.forEach((message, index) => {
      if (message.messageStatus !== "read" && message.sender.toString() === to) {
        messages[index].messageStatus = "read";
        unreadMessages.push(message._id);
      }
    });

    await Message.updateMany(
      { _id: { $in: unreadMessages } },
      { messageStatus: "read" }
    );

    res.json({ messages });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
