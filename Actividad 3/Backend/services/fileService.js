const fs = require('fs').promises;

async function leerArchivo(ruta, defaultValue = []) {
  try {
    const data = await fs.readFile(ruta, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return defaultValue;
  }
}

async function guardarArchivo(ruta, datos) {
  await fs.writeFile(ruta, JSON.stringify(datos, null, 2));
}

module.exports = { leerArchivo, guardarArchivo };