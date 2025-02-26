const express = require('express');
const router = express.Router();
const ControlerGrupo = require('../controller/grupoController');

// Crear grupo
router.post('/uploads_grupo', ControlerGrupo.uploadImage, ControlerGrupo.crearGrupo);
router.get('/uploads_grupo', ControlerGrupo.listraGrupos);
router.delete('/uploads_grupo/:id', ControlerGrupo.eliminarGrupo);
router.put('/uploads_grupo/:id_grupo', ControlerGrupo.uploadImage, ControlerGrupo.editarGrupo);

module.exports = router;