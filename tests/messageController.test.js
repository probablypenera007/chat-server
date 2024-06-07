const request = require('supertest');
const { app, server } = require('../server');
const { connect, closeDatabase, clearDatabase } = require('./fixtures/db');
const mongoose = require('mongoose');

beforeAll(async () => await connect());
afterAll(async () => {
  await closeDatabase();
  server.close();
});
afterEach(async () => await clearDatabase());

describe('Message Functionality', () => {
  let token, userId;

  beforeEach(async () => {
    await request(app)
      .post('/signup')
      .send({ username: 'admin', password: 'password' });

    const loginResponse = await request(app)
      .post('/signin')
      .send({ username: 'admin', password: 'password' });

    token = loginResponse.body.token;
    userId = loginResponse.body._id; // Assuming the response contains the user ID
  });

  it('should send a message', async () => {
    const response = await request(app)
      .post('/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'admin', message: 'Hello, world!' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Hello, world!');
  });

  it('should retrieve messages', async () => {
    const recipientId = new mongoose.Types.ObjectId(); // Simulating a recipient ID
    await request(app)
      .post('/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'admin', message: 'Hello, world!' });

    const response = await request(app)
      .get(`/messages/${userId}/${recipientId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
