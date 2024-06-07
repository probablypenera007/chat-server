const request = require('supertest');
const {app, server} = require("../server")
const chatUser = require("../models/user")
const { connect, closeDatabase, clearDatabase } = require('./fixtures/db');

beforeAll(async () => await connect());
afterAll(async () => {
    await closeDatabase();
    server.close();
})
afterEach(async () => await clearDatabase());

describe('User Authentication', () => {

    it('should signup a new user', async () => {
      const response = await request(app)
        .post('/signup')
        .send({ username: 'admin', password: 'password' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('username', 'admin');
    });
  
    it('should login with valid credentials', async () => {
      await request(app)
        .post('/signup')
        .send({ username: 'admin', password: 'password' });
  
      const response = await request(app)
        .post('/signin')
        .send({ username: 'admin', password: 'password' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  
    it('should not login with invalid credentials', async () => {
      await request(app)
        .post('/signup')
        .send({ username: 'admin', password: 'password' });
  
      const response = await request(app)
        .post('/signin')
        .send({ username: 'admin', password: 'wrongpassword' });
      expect(response.statusCode).toBe(401);
    });
  });