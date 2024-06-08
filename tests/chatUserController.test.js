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

    it('should login a user with correct credentials', async () => {
        await new ChatUser({
            username: 'loginuser',
            password: await bcrypt.hash('password123', 10),
        }).save();

        const res = await request(app)
            .post('/signin')
            .send({
                username: 'newuser123',
                password: 'password123',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login a user with incorrect credentials', async () => {
        const res = await request(app)
            .post('/signin')
            .send({
                username: 'wronguser',
                password: 'wrongpassword',
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'UNAUTHORIZED Access');
    });

    it('should get current user data', async () => {
        const user = await new ChatUser({
            username: 'currentuser',
            password: await bcrypt.hash('password123', 10),
        }).save();

        const token = jwt.sign({ _id: user._id }, 'dev-secret', { expiresIn: '7d' });

        const res = await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('username', 'currentuser'); 
    });
});