const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const USUARIOS_FILE = path.join(__dirname, '..', 'usuarios.json');

async function leerUsuarios() {
  try {
    const data = await fs.readFile(USUARIOS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function guardarUsuarios(usuarios) {
  await fs.writeFile(USUARIOS_FILE, JSON.stringify(usuarios, null, 2));
}

async function encontrarPorEmail(email) {
  const usuarios = await leerUsuarios();
  return usuarios.find(u => u.email === email);
}

async function crearUsuario(email, password) {
  const usuarios = await leerUsuarios();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const nuevoUsuario = {
    id: Date.now().toString(),
    email,
    password: hashedPassword
  };
  usuarios.push(nuevoUsuario);
  await guardarUsuarios(usuarios);
  return nuevoUsuario;
}

async function validarPassword(usuario, password) {
  return bcrypt.compare(password, usuario.password);
}

module.exports = {
  leerUsuarios,
  guardarUsuarios,
  encontrarPorEmail,
  crearUsuario,
  validarPassword
};