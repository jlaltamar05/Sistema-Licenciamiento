const express = require('express');
const router = express.Router();
const c = require('../controllers/usuarios.controller');

router.get('/conectados', c.usuariosConectados);

module.exports = router;
