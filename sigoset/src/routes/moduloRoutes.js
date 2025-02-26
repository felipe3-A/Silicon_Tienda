const express = require('express');
const router = express.Router();
const { crearModuloC, obtenerModulosC,editarModuloC, eliminarModuloC } = require('../controller/moduloController');
const  validarTokenMiddleware= require('../middleware/userAuthentication')

router.get('/api/obtenerModulos', validarTokenMiddleware, obtenerModulosC);
router.post('/api/crearModulo', validarTokenMiddleware, crearModuloC);
router.put('/api/editarPorModulo/:idmodulo', validarTokenMiddleware, editarModuloC);
router.delete('/api/eliminarModulo/:idmodulo', validarTokenMiddleware, eliminarModuloC);

module.exports = router;
