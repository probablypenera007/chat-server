const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../server');
const ChatUser = require('../models/user');
const Message = require('../models/message');
const { encrypt } = require('../utils/encryption');
const { JWT_SECRET } = require('../utils/config');

let mongoServer;
let ioMock;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    ioMock = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
    };

    global.ioMock = ioMock;
    global.onlineUsers = new Map();
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("Message Controller Test", () => {
    let sender;
    let receiver;
    let senderToken;

    beforeEach(async () => {

        sender = await ChatUser.create({
            username: 'senderuser',
            password: 'password123',
        });

        receiver = await ChatUser.create({
            username: 'receiveruser',
            password: 'password123',
        });

        senderToken = jwt.sign({ _id: sender._id }, JWT_SECRET, { expiresIn: '7d' });

        global.onlineUsers.set(receiver._id.toString(), { socketId: '12345' });
    });

    afterEach(async () => {
        // await ChatUser.deleteMany();
        await Message.deleteMany();
    });

    it('should get messages between users', async () => {
        const encryptedMessage = encrypt('Hello there!');
        await Message.create({
            sender: sender._id,
            receiver: receiver._id,
            message: encryptedMessage,
            messageStatus: 'sent',
        });

        const res = await request(app)
            .get(`/messages/${sender._id}/${receiver._id}`)
            .set('Authorization', `Bearer ${senderToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.messages).toHaveLength(1);
        expect(res.body.messages[0]).toHaveProperty('message', 'Hello there!');
    });

    it('should delete a message', async () => {
        const encryptedMessage = encrypt('Hello there!');

        const message = await Message.create({
            sender: sender._id,
            receiver: receiver._id,
            message: encryptedMessage,
            messageStatus: 'sent',
        });

        const res = await request(app)
            .delete(`/messages/${message._id}`)
            .set('Authorization', `Bearer ${senderToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Message deleted successfully');

        const foundMessage = await Message.findById(message._id);
        expect(foundMessage).toBeNull();
    });

    it('should send a message', async () => {
        const res = await request(app)
          .post("/messages")
          .set("Authorization", `Bearer ${senderToken}`)
          .send({
            receiverId: receiver._id,
            message: "Hello there!",
          });
    
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toHaveProperty('message');
        expect(res.body.message).toHaveProperty('sender', sender._id.toString());
        expect(res.body.message).toHaveProperty('receiver', receiver._id.toString());
        expect(res.body.message).toHaveProperty('messageStatus', 'delivered');
      });
})