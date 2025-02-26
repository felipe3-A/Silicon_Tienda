const express = require('express');
const router = express.Router();
const ReporteController = require('../controller/reportesController');

// Ruta para generar un nuevo reporte
router.post('/Reporte',ReporteController.uploadReporte, ReporteController.generarReporte);

// Ruta para obtener todos los reportes
router.get('/ListarReportes', ReporteController.listarReportes);

// Ruta para obtener un reporte por ID
router.get('ListarReporte/:id', ReporteController.obtenerReportePorId);

// Ruta para eliminar un reporte por ID
router.delete('EliminarReporte/:id', ReporteController.eliminarReporte);
//Obtener los usuarios y sus cosas
router.get('/usuarios', ReporteController.obtenerReporteUsuarios);
router.get('/usuarios/:id', ReporteController.obtenerReporteUsuario)

module.exports = router;
