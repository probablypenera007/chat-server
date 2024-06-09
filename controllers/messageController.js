const Message = require("../models/message");
const chatUser = require("../models/user");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const { encrypt, decrypt } = require("../utils/encryption");

/**
 * Sends a message from one user to another.
 * Encrypts the message before saving it to the database.
 * If the receiver is online, the message is marked as "delivered" and sent to the receiver via socket.
 * Updates the sender's and receiver's message lists.
 * Returns the new message in the response.
 *  io - The socket.io instance for real-time communication.
 */
const sendMessage = (io) => async (req, res, next) => {
  try {
    const { receiverId, message } = req.body; // Extract receiverId and message from the request body
    const senderId = req.user._id; // Extract senderId from the authenticated user's information
    const getUser = global.onlineUsers ? global.onlineUsers.get(receiverId) : null; // Check if the receiver is online
     // Validate input
    if (!receiverId || !message || !senderId) {
      return next(new BadRequestError("Receiver ID, sender ID, and message are required!"));
    }
    // Find sender and receiver in the database
    const sender = await chatUser.findById(senderId);
    const receiver = await chatUser.findById(receiverId);
    // Validate sender and receiver existence
    if (!sender || !receiver) {
      return next(new NotFoundError("Sender or receiver not found"));
    }
    // Encrypt the message
    const encryptedMessage = encrypt(message);
    // Create a new message in the database
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: encryptedMessage,
      messageStatus: getUser ? "delivered" : "sent", // Set message status based on receiver's online status
    });

    console.log('New message created:', newMessage);
    // Update sender and receiver's message lists
    sender.sentMessages.push(newMessage._id);
    receiver.receivedMessages.push(newMessage._id);

    await sender.save();
    await receiver.save();
     // If receiver is online, emit the message to their socket
    if (getUser) {
      io.to(getUser.socketId).emit('receiveMessage', newMessage);
    }
    // Send the new message back in the response
    res.send({ message: newMessage });
  } catch (err) {
    console.error('Error creating message:', err);
    next(err);  // Pass error to the error-handling middleware
  }
};
/**
 * Retrieves messages between two users.
 * Decrypts the messages before sending them in the response.
 * Returns the messages in ascending order based on their creation date.
 */
const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.params; // Extract sender and receiver IDs from request parameters
    // Find messages between the two users, sorted by creation date
    const messages = await Message.find({
      $or: [
        { sender: from, receiver: to },
        { sender: to, receiver: from },
      ],
    }).sort({ createdAt: "asc" });
     // Decrypt messages before sending them in the response
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

/**
 * Deletes a message.
 * Validates that the requesting user is the sender of the message.
 * Updates the sender's and receiver's message lists after deletion.
 * Returns a success message in the response.
 */
const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params; // Extract messageId from request parameters
    const userId = req.user._id; // Extract userId from the authenticated user's information

     // Find the message in the database
    const message = await Message.findById(messageId);
    if (!message) {
      return next(new NotFoundError("Message not found"));
    }

    // Ensure the user is the sender of the message
    if (message.sender.toString() !== userId.toString()) {
      return next(new BadRequestError("You can only delete your own messages"));
    }
    // Delete the message from the database
    await Message.deleteOne({ _id: messageId });

    // Update sender and receiver's message lists
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
