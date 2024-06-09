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

    // Step 3: Send a message from sender to receiver

    // Step 4: Retrieve messages between sender and receiver
  });
});
