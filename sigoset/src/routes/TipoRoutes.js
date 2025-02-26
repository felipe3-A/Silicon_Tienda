const express = require('express');
const router = express.Router();
const TipoController = require('../controller/tipoController');

// Ruta para obtener todos los tipos
router.get('/tipos', TipoController.listarTipos);

// Ruta para crear un tipo
router.post('/tipos', TipoController.crearTipo);

// Ruta para eliminar un tipo
router.delete('/tipos/:id', TipoController.eliminarTipo);

// Nueva ruta para editar un tipo
router.put('/tipos/:id', TipoController.editarTipo);

module.exports = router;
