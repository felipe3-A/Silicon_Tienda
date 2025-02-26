const express = require('express');
const router = express.Router();
const {
    crearModuloXperfilC,
    obtenerModuloxperfilC,
    editarModuloXperfilC,
    obtenerModuloxperfilListC
} = require('../controller/moduloxperfilController');
const  validarTokenMiddleware= require('../middleware/userAuthentication')

router.get('/api/obtenerModulosXperfil', validarTokenMiddleware, obtenerModuloxperfilC);
router.post('/api/crearModuloXperfil', validarTokenMiddleware, crearModuloXperfilC);
router.put('/api/editarModuloXperfil/:idmodulo/:idperfil', validarTokenMiddleware, editarModuloXperfilC);
router.get('/api/obtenerModulosPorPerfil/:idperfil', validarTokenMiddleware, obtenerModuloxperfilListC);
module.exports = router;
