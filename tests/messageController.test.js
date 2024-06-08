const request = require('supertest');
const { app, server } = require('../server');
// const mongoose = require('mongoose');
const User = require('../models/user');
const { connect, closeDatabase, clearTestUsers } = require('./fixtures/db');

let token;
let senderId;
let receiverId;

beforeAll(async () => {
  // await clearTestUsers();
  await connect();
  await clearTestUsers();
  await request(app)
    .post('/signup')
    .send({ username: 'sender', password: 'password' });

  await request(app)
    .post('/signup')
    .send({ username: 'receiver', password: 'password' });

  const response = await request(app)
    .post('/signin')
    .send({ username: 'sender', password: 'password' });

  token = response.body.token;
  const sender = await User.findOne({ username: 'sender' });
  const receiver = await User.findOne({ username: 'receiver' });

  senderId = sender._id;
  receiverId = receiver._id;
});

afterAll(async () => {
  await clearTestUsers();
  await closeDatabase();
  server.close();
}, 50000);

afterEach(async () => {
  await clearTestUsers();
  server.close();
});

describe('Message Controller Test', () => {
  it('should send a message', async () => {
    const response = await request(app)
      .post('/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        receiverId,
        message: 'Hello!',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toHaveProperty('message');
  });

  it('should get messages between users', async () => {
    const response = await request(app)
      .get(`/messages/${senderId}/${receiverId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.messages).toBeInstanceOf(Array);
  });
});