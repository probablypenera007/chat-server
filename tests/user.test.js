const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ChatUser = require('../models/user');

const { connect, closeDatabase } = require('./fixtures/db');

beforeAll(async () => {
    await connect();
  });
  
  afterAll(async () => {
    await closeDatabase();
  });

  describe('ChatUser Model Test', () => {
    it('should create a user with required fields', async () => {
      const user = new ChatUser({
        username: 'testuser12345',
        password: await bcrypt.hash('password', 10),
      });
      const savedUser = await user.save();
  
      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe('testuser12345');
      expect(savedUser.password).toBeDefined();
    });



});