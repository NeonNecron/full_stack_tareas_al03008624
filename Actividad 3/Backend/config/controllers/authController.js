const Usuario = require('../../models/Usuario');
const jwt = require('jsonwebtoken');

async function registrarUsuario(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
    }

    const existe = await Usuario.encontrarPorEmail(email);
    if (existe) {
      return res.status(400).json({ error: 'El usuario ya está registrado.' });
    }

    await Usuario.crearUsuario(email, password);
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' });
  } catch (error) {
    next(error);
  }
}

async function loginUsuario(req, res, next) {
  console.log('loginUsuario ejecutandose');
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
    }

    const usuario = await Usuario.encontrarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const valido = await Usuario.validarPassword(usuario, password);
    if (!valido) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.SECRET_KEY || 'clave_secreta',
      { expiresIn: '2h' }
    );

    res.json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    next(error);
  }
}

module.exports = { registrarUsuario, loginUsuario };