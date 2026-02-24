const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Conectar a BD en memoria antes de todas las pruebas
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Limpiar datos después de cada prueba
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Desconectar y cerrar BD después de todas las pruebas
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});