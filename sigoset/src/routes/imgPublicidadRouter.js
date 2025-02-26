const express = require ('express')
const router = express.Router();
const ImgPublicidad = require('../controller/imgPublicidadController')

//Listar productos por tipo
router.get('/tipo/:idTipo', ImgPublicidad.listarimagenportipo);
// Crear imagen publicitaria
router.post('/uploads_publicidad', ImgPublicidad.uploadImage,ImgPublicidad.crearImgPublicidad);
// Listar todas las imagnes
router.get('/uploads_publicidad', ImgPublicidad.listarImagenesPub);
// Eliminar por id
router.delete('/uploads_publicidad/:id', ImgPublicidad.eliminarImagenPub)

router.get("/buscar/:id", ImgPublicidad.obtenerImagenPublicidad);

//Editar Imagen
// router.js
router.put('/uploads_publicidad/:id_imagen_publicitaria', ImgPublicidad.uploadImage, ImgPublicidad.actualizarImagenPublicidad);

module.exports = router