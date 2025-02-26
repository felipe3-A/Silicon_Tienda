const express = require('express');
const router = express.Router();
const valoresCaracteristicaController = require('../controller/valoresCaracteristicasController');

router.get('/valoresCaracteristicas', valoresCaracteristicaController.getAllValoresCaracteristicas);
router.get('/producto/:id_imagen', valoresCaracteristicaController.getValoresByProducto);
router.post('/valoresCaracteristicas', valoresCaracteristicaController.createValorCaracteristica);

module.exports = router;