const Tarea = require('../../models/Tarea');

async function obtenerTareas(req, res, next) {
  try {
    const tareas = await Tarea.leerTareas();
    res.json(tareas);
  } catch (error) {
    next(error);
  }
}

async function crearTarea(req, res, next) {
  try {
    const { titulo, descripcion } = req.body;
    if (!titulo || !descripcion) {
      return res.status(400).json({ error: 'Título y descripción son requeridos.' });
    }
    const nueva = await Tarea.crearTarea(titulo, descripcion);
    res.status(201).json(nueva);
  } catch (error) {
    next(error);
  }
}

async function actualizarTarea(req, res, next) {
  try {
    const { id } = req.params;
    const tareaActualizada = await Tarea.actualizarTarea(id, req.body);
    if (!tareaActualizada) {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }
    res.json(tareaActualizada);
  } catch (error) {
    next(error);
  }
}

async function eliminarTarea(req, res, next) {
  try {
    const { id } = req.params;
    const eliminada = await Tarea.eliminarTarea(id);
    if (!eliminada) {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }
    res.json({ mensaje: 'Tarea eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtenerTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea
};