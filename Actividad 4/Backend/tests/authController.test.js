const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    test('debería registrar un nuevo usuario', async () => {
      const newUser = {
        name: 'Usuario Test',
        email: 'test@test.com',
        password: '123456'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
      expect(response.body).toHaveProperty('token');
    });

    test('no debería registrar usuario con email existente', async () => {
      // Crear usuario primero
      await User.create({
        name: 'Existente',
        email: 'duplicado@test.com',
        password: '123456'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Otro',
          email: 'duplicado@test.com',
          password: '123456'
        })
        .expect(400);

      expect(response.body.message).toBe('El usuario ya existe');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Login Test',
        email: 'login@test.com',
        password: '123456'
      });
    });

    test('debería hacer login con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: '123456'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.email).toBe('login@test.com');
    });

    test('no debería hacer login con contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toBe('Email o contraseña incorrectos');
    });
  });
});