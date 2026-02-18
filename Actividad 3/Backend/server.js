const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const productoRoutes = require('./routes/productoRoutes');
const { manejar404, manejarErrores } = require('./middleware/errorMiddleware');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/productos', productoRoutes);

// Servir archivos estáticos del frontend (build)
app.use(express.static(path.join(__dirname, '../frontend-react/build')));

// Cualquier otra ruta que no sea archivo estático sirve index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend-react/build', 'index.html'));
});

// Middlewares de error
app.use(manejar404);
app.use(manejarErrores);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
