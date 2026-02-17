const express = require('express');
const autenticarToken = require('../middleware/authMiddleware');
const { obtenerTareas, crearTarea, actualizarTarea, eliminarTarea } = require('../config/controllers/tareaController');
const router = express.Router();

// Todas las rutas de tareas requieren autenticación
router.use(autenticarToken);

router.get('/', obtenerTareas);
router.post('/', crearTarea);
router.put('/:id', actualizarTarea);
router.delete('/:id', eliminarTarea);

module.exports = router;