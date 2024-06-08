// const mongoose = require('mongoose');
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

    it('should find a user by credentials', async () => {
        const user = new ChatUser({
          username: 'validuser',
          password: await bcrypt.hash('validpassword', 10),
        });
        await user.save();
    
        const foundUser = await ChatUser.findUserByCredentials('validuser', 'validpassword');
        expect(foundUser).toBeDefined();
        expect(foundUser.username).toBe('validuser');
      });

      it('should not find a user with incorrect credentials', async () => {
        let err;
        try {
          await ChatUser.findUserByCredentials('invaliduser', 'invalidpassword');
        } catch (error) {
          err = error;
        }
        expect(err).toBeDefined();
        expect(err.message).toBe('Incorrect username or password');
      });
});