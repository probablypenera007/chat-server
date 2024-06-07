const express = require('express');
const request = require('supertest');
const { auth } = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

const app = express();
app.use(express.json());

app.get('/protected', auth, (req, res) => {
  res.status(200).send('Protected content');
});

describe('Authentication Middleware', () => {
    const validToken = jwt.sign({ _id: 'user1' }, JWT_SECRET, { expiresIn: '1h' });
    const invalidToken = 'invalidtoken';
  
    it('should allow access with a valid token', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${validToken}`);
  
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Protected content');
    });
    it('should deny access with no token', async () => {
      const response = await request(app).get('/protected');
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Authorization required auth.js');
    });
  

});