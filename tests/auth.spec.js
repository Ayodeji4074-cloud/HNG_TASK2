const request = require('supertest');
const { sequelize, User } = require('../models');
const app = require('../app');

let server;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  server = app.listen(4001, () => console.log(`Server started on port 4001`));
  await User.create({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phone: '1234567890'
  });
}, 30000); // Increased timeout to 30 seconds

afterAll(async () => {
  await sequelize.close();
  server.close();
});

describe('Auth Routes', () => {
  test('should register a user', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
        phone: '0987654321'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  test('should login a user', async () => {
    const res = await request(server)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
