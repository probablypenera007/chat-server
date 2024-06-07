const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const Message = require('../models/message');
const ChatUser = require('../models/user');
const { connect, closeDatabase } = require('./fixtures/db');

beforeAll(async () => {
    await connect();
  
    await new ChatUser({
      username: 'sender123',
      password: await bcrypt.hash('password', 10),
    }).save();
    
    await new ChatUser({
      username: 'receiver123',
      password: await bcrypt.hash('password', 10),
    }).save();
  });
  
  afterAll(async () => {
    await closeDatabase();
  });
  
  describe('Message Model Test', () => {
    it('should create a message with required fields', async () => {
        const sender = await ChatUser.findOne({ username: 'sender123' });
        const receiver = await ChatUser.findOne({ username: 'receiver123' });
    
        const message = new Message({
          sender: sender._id,
          receiver: receiver._id,
          message: 'Hello!',
        });
        const savedMessage = await message.save();
    
        expect(savedMessage._id).toBeDefined();
        expect(savedMessage.sender).toBe(sender._id);
        expect(savedMessage.receiver).toBe(receiver._id);
        expect(savedMessage.message).toBe('Hello!');
        expect(savedMessage.messageStatus).toBe('sent');
        expect(savedMessage.createdAt).toBeDefined();
      });
  });