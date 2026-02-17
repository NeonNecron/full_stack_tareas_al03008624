// Middleware para rutas no encontradas (404)
function manejar404(req, res, next) {
  res.status(404).json({ error: 'Ruta no encontrada.' });
}

// Middleware para errores generales del servidor (500)
function manejarErrores(err, req, res, next) {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor.' });
}

module.exports = {
  manejar404,
  manejarErrores
};