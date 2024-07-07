const request = require('supertest');
const { sequelize, User, Organisation } = require('../models');
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

describe('Organisation Routes', () => {
  test('should create a new organisation', async () => {
    const res = await request(server)
      .post('/organisations')
      .send({
        name: 'New Org',
        description: 'A new organisation'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('should retrieve all organisations for the logged-in user', async () => {
    const res = await request(server)
      .get('/organisations')
      .set('Authorization', `Bearer ${token}`); // Use a valid token here
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('should retrieve a single organisation by ID', async () => {
    const res = await request(server)
      .get('/organisations/1')
      .set('Authorization', `Bearer ${token}`); // Use a valid token here
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  test('should add a user to an organisation', async () => {
    const res = await request(server)
      .post('/organisations/1/users')
      .send({ userId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });
});
