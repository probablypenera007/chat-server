const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../server');
const ChatUser = require('../models/user');
const Message = require('../models/message');
const { JWT_SECRET } = require('../utils/config');

let mongoServer;
let senderToken;
let sender;
let receiver;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  sender = await ChatUser.create({
    username: 'senderuser',
    password: 'password123',
  });

  receiver = await ChatUser.create({
    username: 'receiveruser',
    password: 'password123',
  });

  senderToken = jwt.sign({ _id: sender._id }, JWT_SECRET, { expiresIn: '7d' });

  global.onlineUsers = new Map();
  global.onlineUsers.set(receiver._id.toString(), { socketId: '12345' });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Integration Tests', () => {
  it('should create a user, log in, send a message, and get messages', async () => {
    // Step 1: Create a new user
    const newUserResponse = await request(app)
    .post('/signup')
    .send({
        username: 'newuser123',
        password: 'password123'
    });
    expect(newUserResponse.statusCode).toBe(200)
    expect(newUserResponse.body).toHaveProperty('username', 'newuser123');

    // Step 2: Log in with the created user
    const loginResponse = await request(app)
    .post('/signin')
    .send({
        username: 'newuser123',
        password: 'password123'
    })
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty('token')
    // const newUserToken = loginResponse.body.token;
    // Step 3: Send a message from sender to receiver
    const sendMessageResponse = await request(app)
    .post('/messages')
    .set('Authorization', `Bearer ${senderToken}`)
    .send({
        receiverId: receiver._id,
        message: 'Hello! Anyone out there?',
    })

    expect(sendMessageResponse.statusCode).toBe(200);
    expect(sendMessageResponse.body.message).toHaveProperty('message');
    expect(sendMessageResponse.body.message).toHaveProperty('sender', sender._id.toString());
    expect(sendMessageResponse.body.message).toHaveProperty('receiver', receiver._id.toString());

    // Step 4: Retrieve messages between sender and receiver
    const getMessagesResponse = await request(app)
    .get(`/messages/${sender._id}/${receiver._id}`)
    .set('Authorization', `Bearer ${senderToken}`);

    expect(getMessagesResponse.statusCode).toBe(200)
    expect(getMessagesResponse.body.messages).toHaveLength(1)
    expect(getMessagesResponse.body.messages[0]).toHaveProperty('message', 'Hello! Anyone out there?');
  })
  it('should delete a message', async () => {
    const encryptedMessage = 'encrypted-message';

    const message = await Message.create({
      sender: sender._id,
      receiver: receiver._id,
      message: encryptedMessage,
      messageStatus: 'sent',
    });

    const deleteMessageResponse = await request(app)
      .delete(`/messages/${message._id}`)
      .set('Authorization', `Bearer ${senderToken}`);

    expect(deleteMessageResponse.statusCode).toBe(200);
    expect(deleteMessageResponse.body).toHaveProperty('message', 'Message deleted successfully');

    const foundMessage = await Message.findById(message._id);
    expect(foundMessage).toBeNull();
  });
});
