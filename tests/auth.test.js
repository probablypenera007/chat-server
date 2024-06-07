const express = require('express');
const request = require('supertest');
const { auth } = require('../middlewares/auth');


const app = express();
app.use(express.json());

app.get('/protected', auth, (req, res) => {
  res.status(200).send('Protected content');
});

describe('Authentication Middleware', () => {
});