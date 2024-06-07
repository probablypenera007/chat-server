const request = require('supertest');
const { app, server } = require("../server");
const { connect, closeDatabase, clearTestUsers } = require('./fixtures/db');

beforeAll(async () => {
  // await connect()
  await clearTestUsers();
});

afterEach(() => {
  server.close();
});

afterAll(async () => {
  await clearTestUsers();
  await closeDatabase();
  server.close()
});
// afterEach(async () => await closeDatabase())


describe('User Authentication', () => {
  it('should signup a new user', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ username: 'admin', password: 'password' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username', 'admin');
  });

  it('should signup another new user', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ username: 'testuser', password: 'password' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should not signup with an existing username', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ username: 'admin', password: 'password' });
    expect(response.statusCode).toBe(409);
  });

  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/signin')
      .send({ username: 'admin', password: 'password' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const response = await request(app)
      .post('/signin')
      .send({ username: 'admin', password: 'wrongpassword' });
    expect(response.statusCode).toBe(401);
  });

  it('should get the current user data', async () => {
    const signinResponse = await request(app)
      .post('/signin')
      .send({ username: 'admin', password: 'password' });

    const token = signinResponse.body.token;

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('username', 'admin');
  });

  it('should not get user data without a token', async () => {
    const response = await request(app)
      .get('/users/me');

    expect(response.statusCode).toBe(401);
  });
});
