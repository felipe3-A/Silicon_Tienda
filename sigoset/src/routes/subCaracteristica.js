const express = require('express');
const router = express.Router();
const subcaracteristicaController = require('../controller/subCaracteristicaController');

 router.get('/subcaracteristica', subcaracteristicaController.getAllSubcaracteristicas);
// router.get('/subcaracteristica/:id', subcaracteristicaController.getSubcaracteristicaById);
router.post('/subcaracteristica',subcaracteristicaController.createSubcaracteristica );

module.exports = router;