const express = require('express');
const router = express.Router();
const c = require('../controllers/companias.controller');

router.get('/licencias', c.panelLicencias);
router.put('/:id/licencia', c.actualizarLicencia);

module.exports = router;
