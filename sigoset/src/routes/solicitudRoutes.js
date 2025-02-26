// routes/solicitudRoutes.js
const express = require('express');
const router = express.Router();
const SolicitudController = require('../controller/solicitudController');

// Ruta para crear una nueva solicitud
router.post('/solicitudes', SolicitudController.uploadImagesSolicitudes, SolicitudController.crearSolicitud);

// Ruta para listar todas las solicitudes
router.get('/solicitudes', SolicitudController.listarSolicitudes);

// Ruta para obtener una solicitud por ID
router.get('/solicitudes/:id_solicitud', SolicitudController.listarSolicitudPorId);

// Ruta para eliminar una solicitud
router.delete('/solicitudes/:id_solicitud', SolicitudController.eliminarSolicitud)

//Crear la galeria de fotos para la solicitud
router.post('/upload_gallery_solicitudes', SolicitudController.uploadImagesSolicitudes, SolicitudController.uploadImagesGalleySolicitud);

router.get(
    '/upload_gallery_solicitudes',
    SolicitudController.ListarGaleriaSolicitudes, // Usa el middleware correcto

);
//Listar tipo de Articulo y tipo de servicios
router.get('/tipoArticulo', SolicitudController.ListarTipoArticulos);
router.get('/tipoServicio', SolicitudController.ListarTipoServicio);


module.exports = router;