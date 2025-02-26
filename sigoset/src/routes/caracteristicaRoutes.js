const express = require('express');
const router = express.Router();
const caracteristicaController = require('../controller/caracteristicaController');

router.get('/caracteristicas', caracteristicaController.getAllCaracteristicas);
router.post('/caracteristicas', caracteristicaController.createCaracteristica); // Estaba mal, debe ser `createCaracteristica`
router.get('/caracteristicas/:id_categoria', caracteristicaController.getCaracteristicasByCategoria);

module.exports = router;
