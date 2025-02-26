// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const {
    crearPerfilC,
    obtenerPerfilesC,
    editarPerfilC,
    eliminarPerfilC
     } = require('../controller/perfilController');
const  validarTokenMiddleware= require('../middleware/VerificadorToken')

router.post('/api/crearPerfil', validarTokenMiddleware,  crearPerfilC); 
router.get('/api/listPerfil', validarTokenMiddleware,  obtenerPerfilesC);
router.put('/api/editPerfil/:idperfil', validarTokenMiddleware, editarPerfilC);
router.delete('/api/EliminarPerfil/:idperfil', validarTokenMiddleware, eliminarPerfilC);


module.exports = router;
