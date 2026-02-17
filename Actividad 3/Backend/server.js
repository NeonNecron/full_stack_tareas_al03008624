const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const tareaRoutes = require('./routes/tareaRoutes');
const { manejar404, manejarErrores } = require('./middleware/errorMiddleware');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de log (opcional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API (deben ir antes del estático y catch-all)
app.use('/auth', authRoutes);
console.log('Rutas de autenticación montadas en /auth');
app.use('/tareas', tareaRoutes);

// Servir archivos estáticos del frontend (después de las rutas API)
app.use(express.static(path.join(__dirname, '../frontend-react/build')));

// Catch-all: cualquier otra ruta (que no sea API ni archivo estático) sirve index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend-react/build', 'index.html'));
});

// Middlewares de error (deben ir al final)
app.use(manejar404);
app.use(manejarErrores);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});