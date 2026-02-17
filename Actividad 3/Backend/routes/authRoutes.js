const express = require('express');
const { registrarUsuario, loginUsuario } = require('../config/controllers/authController');

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

router.post('/login', (req, res, next) => {
  console.log('✅ Ruta POST /auth/login fue alcanzada');
  loginUsuario(req, res, next);
});

module.exports = router;