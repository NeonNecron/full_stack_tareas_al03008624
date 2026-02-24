const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

// Solo conectar a la BD si no estamos en pruebas
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

app.get('/', (req, res) => {
  res.send('API funcionando');
});

module.exports = app;