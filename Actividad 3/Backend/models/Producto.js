const fs = require('fs').promises;
const path = require('path');

const PRODUCTOS_FILE = path.join(__dirname, '..', 'productos.json');

async function leerProductos() {
  try {
    const data = await fs.readFile(PRODUCTOS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function guardarProductos(productos) {
  await fs.writeFile(PRODUCTOS_FILE, JSON.stringify(productos, null, 2));
}

async function crearProducto(nombre, descripcion, cantidad, precio) {
  const productos = await leerProductos();
  const nuevo = {
    id: Date.now().toString(),
    nombre,
    descripcion,
    cantidad: cantidad || 0,
    precio: precio || 0,
    fechaCreacion: new Date().toISOString()
  };
  productos.push(nuevo);
  await guardarProductos(productos);
  return nuevo;
}

async function actualizarProducto(id, datos) {
  const productos = await leerProductos();
  const index = productos.findIndex(p => p.id === id);
  if (index === -1) return null;
  if (datos.nombre !== undefined) productos[index].nombre = datos.nombre;
  if (datos.descripcion !== undefined) productos[index].descripcion = datos.descripcion;
  if (datos.cantidad !== undefined) productos[index].cantidad = datos.cantidad;
  if (datos.precio !== undefined) productos[index].precio = datos.precio;
  await guardarProductos(productos);
  return productos[index];
}

async function eliminarProducto(id) {
  const productos = await leerProductos();
  const nuevos = productos.filter(p => p.id !== id);
  if (productos.length === nuevos.length) return false;
  await guardarProductos(nuevos);
  return true;
}

module.exports = {
  leerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};