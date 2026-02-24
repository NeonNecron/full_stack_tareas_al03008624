const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const jwt = require('jsonwebtoken');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Crear usuario y token antes de cada prueba
beforeEach(async () => {
  // Limpiar colecciones
  await User.deleteMany();
  await Product.deleteMany();

  // Crear usuario de prueba
  const user = await User.create({
    name: 'Test User',
    email: 'test@test.com',
    password: '123456'
  });
  userId = user._id;

  // Generar token
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'testsecret');
});

describe('Product Controller', () => {
  
  describe('POST /api/products', () => {
    test('debería crear producto con token válido', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Producto 1',
          price: 100,
          description: 'Descripción de prueba'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Producto 1');
      expect(res.body.price).toBe(100);
      expect(res.body.description).toBe('Descripción de prueba');
      expect(res.body.user).toBe(userId.toString());
      expect(res.body).toHaveProperty('_id');
    });

    test('debería devolver 401 si no se envía token', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Producto 2',
          price: 200
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('No autorizado, token requerido');
    });

    test('debería devolver 500 si faltan campos requeridos (name)', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          price: 100
          // falta name
        });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toMatch(/validation failed|required/);
    });

    test('debería devolver 500 si faltan campos requeridos (price)', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Producto sin precio'
        });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toMatch(/validation failed|required/);
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Crear algunos productos para el usuario
      await Product.create([
        { name: 'Producto A', price: 10, user: userId },
        { name: 'Producto B', price: 20, user: userId },
        { name: 'Producto C', price: 30, user: userId }
      ]);
    });

    test('debería obtener todos los productos del usuario autenticado', async () => {
      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0].user).toBe(userId.toString());
    });

    test('debería devolver 401 sin token', async () => {
      const res = await request(app)
        .get('/api/products');

      expect(res.statusCode).toBe(401);
    });

    test('debería devolver array vacío si el usuario no tiene productos', async () => {
      // Eliminar productos de este usuario (ya se limpia en beforeEach)
      await Product.deleteMany({ user: userId });

      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Producto Original',
        price: 50,
        description: 'Descripción original',
        user: userId
      });
      productId = product._id;
    });

    test('debería actualizar producto existente', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Producto Actualizado',
          price: 75,
          description: 'Nueva descripción'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Producto Actualizado');
      expect(res.body.price).toBe(75);
      expect(res.body.description).toBe('Nueva descripción');
    });

    test('debería devolver 404 si el producto no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Nuevo nombre' });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Producto no encontrado');
    });

    test('debería devolver 401 si el producto pertenece a otro usuario', async () => {
      // Crear otro usuario
      const otherUser = await User.create({
        name: 'Otro Usuario',
        email: 'other@test.com',
        password: '123456'
      });

      const otherProduct = await Product.create({
        name: 'Producto de otro',
        price: 100,
        user: otherUser._id
      });

      const res = await request(app)
        .put(`/api/products/${otherProduct._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Intento de hack' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('No autorizado');
    });

    test('debería devolver 401 sin token', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .send({ name: 'Sin token' });

      expect(res.statusCode).toBe(401);
    });

    test('debería actualizar solo los campos enviados', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ price: 99 });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Producto Original'); // se conserva
      expect(res.body.price).toBe(99);
      expect(res.body.description).toBe('Descripción original');
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Producto a eliminar',
        price: 30,
        user: userId
      });
      productId = product._id;
    });

    test('debería eliminar producto existente', async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Producto eliminado');

      // Verificar que ya no existe
      const deletedProduct = await Product.findById(productId);
      expect(deletedProduct).toBeNull();
    });

    test('debería devolver 404 si el producto no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Producto no encontrado');
    });

    test('debería devolver 401 si el producto pertenece a otro usuario', async () => {
      // Crear otro usuario
      const otherUser = await User.create({
        name: 'Otro Usuario',
        email: 'other@test.com',
        password: '123456'
      });

      const otherProduct = await Product.create({
        name: 'Producto de otro',
        price: 100,
        user: otherUser._id
      });

      const res = await request(app)
        .delete(`/api/products/${otherProduct._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('No autorizado');
    });

    test('debería devolver 401 sin token', async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`);

      expect(res.statusCode).toBe(401);
    });
  });
});