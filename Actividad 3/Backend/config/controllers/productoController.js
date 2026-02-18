const Producto = require('../../models/Producto');

async function obtenerProductos(req, res, next) {
  try {
    const productos = await Producto.leerProductos();
    res.json(productos);
  } catch (error) {
    next(error);
  }
}

async function crearProducto(req, res, next) {
  try {
    const { nombre, descripcion, cantidad, precio } = req.body;
    if (!nombre || !descripcion) {
      return res.status(400).json({ error: 'Nombre y descripción son requeridos' });
    }
    const nuevo = await Producto.crearProducto(nombre, descripcion, cantidad, precio);
    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
}

async function actualizarProducto(req, res, next) {
  try {
    const { id } = req.params;
    const actualizado = await Producto.actualizarProducto(id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (error) {
    next(error);
  }
}

async function eliminarProducto(req, res, next) {
  try {
    const { id } = req.params;
    const eliminado = await Producto.eliminarProducto(id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};