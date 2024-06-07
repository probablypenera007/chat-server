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

  });