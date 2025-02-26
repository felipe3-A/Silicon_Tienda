// routes/imagenRoutes.js
const express = require('express');
const router = express.Router();
const ImagenController = require('../controller/imageController'); // Asegúrate de que la ruta sea correcta
const upload = require('../uploads_galelly/uploads_galleria');
const uploadGalleria = require('../uploads_galelly/uploads_galleria'); // Asegúrate de que la ruta sea correcta

// Ruta para listar imágenes por categoría
router.get('/categoria/:id_categoria', ImagenController.listarImagenesPorCategoria);

// Ruta para listar imágenes por marca
router.get('/marca/:id_marca', ImagenController.listarImagenesPorMarca);

// Otras rutas como subir, listar, eliminar imágenes
router.post('/upload', ImagenController.uploadImage, ImagenController.crearImagen);
router.get('/upload', ImagenController.listarImagenes);
router.get('/upload/:id_imagen', ImagenController.listarImagenPorId);

router.delete('/upload/:id', ImagenController.eliminarImagen);
// routes/imagenRoutes.js
router.put('/upload/:id_imagen', ImagenController.uploadImage, ImagenController.editarProducto);

// Ruta para listar imágenes por grupo
router.get('/upload_grupo/:id_grupo', ImagenController.listarImagenesPorGrupo);

//Crear la galeria
router.post(
    '/uploads_gallery',
   ImagenController.uploadGallery,// Usa el middleware correcto
    ImagenController.uploadImages
);
// Ruta para obtener las imágenes almacenadas
router.get('/uploads_gallery', ImagenController.ListarGaleria)


// Ruta para obtener la galería por ID
router.get('/upload_gallery/:id_galeria', ImagenController.obtenerGaleriaPorId);



module.exports = router;
