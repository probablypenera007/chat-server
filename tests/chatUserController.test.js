const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../server');
const ChatUser = require('../models/user');


let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('ChatUser Controller Test', () => {
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/signup')
            .send({
                username: 'newuser123',
                password: 'password123',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('username', 'newuser123');
    });

    it('should not create a user with existing username', async () => {
        await new ChatUser({
            username: 'duplicateuser',
            password: await bcrypt.hash('password123', 10),
        }).save();

        const res = await request(app)
            .post('/signup')
            .send({
                username: 'duplicateuser',
                password: 'password123',
            });

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('message', 'CONFLICT, resource already exists');
    });

});