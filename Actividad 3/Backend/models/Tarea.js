const fs = require('fs').promises;
const path = require('path');

const TAREAS_FILE = path.join(__dirname, '..', 'tareas.json');

async function leerTareas() {
  try {
    const data = await fs.readFile(TAREAS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function guardarTareas(tareas) {
  await fs.writeFile(TAREAS_FILE, JSON.stringify(tareas, null, 2));
}

async function encontrarPorId(id) {
  const tareas = await leerTareas();
  return tareas.find(t => t.id === id);
}

async function crearTarea(titulo, descripcion) {
  const tareas = await leerTareas();
  const nuevaTarea = {
    id: Date.now().toString(),
    titulo,
    descripcion,
    completada: false
  };
  tareas.push(nuevaTarea);
  await guardarTareas(tareas);
  return nuevaTarea;
}

async function actualizarTarea(id, datos) {
  const tareas = await leerTareas();
  const indice = tareas.findIndex(t => t.id === id);
  if (indice === -1) return null;
  
  // Actualizar solo los campos proporcionados
  if (datos.titulo !== undefined) tareas[indice].titulo = datos.titulo;
  if (datos.descripcion !== undefined) tareas[indice].descripcion = datos.descripcion;
  if (datos.completada !== undefined) tareas[indice].completada = datos.completada;
  
  await guardarTareas(tareas);
  return tareas[indice];
}

async function eliminarTarea(id) {
  const tareas = await leerTareas();
  const nuevasTareas = tareas.filter(t => t.id !== id);
  if (tareas.length === nuevasTareas.length) return false;
  await guardarTareas(nuevasTareas);
  return true;
}

module.exports = {
  leerTareas,
  guardarTareas,
  encontrarPorId,
  crearTarea,
  actualizarTarea,
  eliminarTarea
};