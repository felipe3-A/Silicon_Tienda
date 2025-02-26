const ReporteService = require("../services/reportesService"); // Asegurar que el nombre coincide
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Usuario, findById } = require("../models/UsuarioModel");
const{findByPk} = require("../models/UsuarioModel")

const controller = {};

// Crear carpeta si no existe
const imageReportsPath = path.join(__dirname, "../../reportes");
if (!fs.existsSync(imageReportsPath)) {
  fs.mkdirSync(imageReportsPath, { recursive: true });
}

// Configuración de almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: imageReportsPath,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage }); // Para aceptar solo un archivo
controller.uploadReporte = upload.single("evidencia");

// Generar un reporte
controller.generarReporte = async (req, res) => {
  try {
      const { usuario_id, estado, metodo_pago, fecha_pago, total, fecha_reporte } = req.body;

      // Validar usuario_id
      if (!usuario_id) {
          return res.status(400).json({ error: "El parámetro usuario_id es requerido." });
      }

      // Validar estado
      if (!estado) {
          return res.status(400).json({ error: "El estado es requerido." });
      }

      // Validar metodo_pago
      if (!metodo_pago) {
          return res.status(400).json({ error: "El método de pago es requerido." });
      }

      // Buscar usuario
      const usuario = await findById(usuario_id);
      if (!usuario) {
          return res.status(404).json({ error: "El usuario no existe." });
      }

      // Validar evidencia
      const evidencia = req.file
          ? `http://localhost:3000/uploads_reportes/${req.file.filename}`
          : null;

      // if (!req.file) {
      //     return res.status(400).json({ message: "La imagen es requerida." });
      // }

      // Crear objeto nuevoReporte
      const nuevoReporte = {
          usuario_id: usuario.id || null,
          evidencia: evidencia || null,
          estado: estado || null,
          total: total !== undefined ? total : null,
          fecha_pago: fecha_pago || new Date(),
          metodo_pago: metodo_pago || null,
          fecha_reporte: fecha_reporte || new Date(),
      };

      // Verificar si hay campos faltantes
      const camposFaltantes = [];
      for (const [key, value] of Object.entries(nuevoReporte)) {
          if (value === undefined) {
              camposFaltantes.push(key);
              nuevoReporte[key] = null; // Convertir a null si es undefined
          }
      }

      if (camposFaltantes.length > 0) {
          return res.status(400).json({ message: `Campos faltantes convertidos a null: ${camposFaltantes.join(", ")}` });
      }

      console.log("Valores enviados al servicio:", nuevoReporte);

      // Crear el reporte
      const result = await ReporteService.crearReporte(nuevoReporte);

      res.status(200).json({
          message: "Reporte generado exitosamente",
          data: { id: result.insertId, ...nuevoReporte },
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al generar el reporte", error: error.message });
  }
};

controller.obtenerReporteUsuarios = async (req, res) => {
  try {
      const reporte = await ReporteService.obtenerReporteUsuarios();
      res.status(200).json(reporte);
  } catch (error) {
      console.error("Error en el controlador al obtener el reporte de usuarios:", error);
      res.status(500).json({ error: "Error al obtener el reporte de usuarios" });
  }
};

controller.obtenerReporteUsuario = async (req, res) => {
  try {
      const usuarioId = req.params.id;
      const reporte = await ReporteService.obtenerReporteUsuarioPorId(usuarioId);

      if (reporte.length === 0) {
          return res.status(404).json({ mensaje: "No se encontraron datos para este usuario." });
      }

      res.json(reporte);
  } catch (error) {
      console.error('Error en el controlador al obtener el reporte del usuario:', error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};


// Listar reportes disponibles
controller.listarReportes = async (req, res) => {
  try {
    const reportes = await ReporteService.listarReportes();
    res.status(200).json({
      message: "Reportes listados correctamente",
      data: reportes,
    });
  } catch (error) {
    res.status(500).json({
      message: "No se pudieron listar los reportes",
      error: error.message,
    });
  }
};

// Obtener un reporte por ID
controller.obtenerReportePorId = async (req, res) => {
  const { id_reporte } = req.params;

  try {
    const reporte = await ReporteService.obtenerReportePorId(id_reporte);
    if (!reporte) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }
    res.status(200).json({
      message: "Reporte encontrado",
      data: reporte,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener el reporte", error: error.message });
  }
};

// Eliminar un reporte
controller.eliminarReporte = async (req, res) => {
  const { id_reporte } = req.params;

  try {
    const reporte = await ReporteService.obtenerReportePorId(id_reporte);
    if (!reporte) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    await ReporteService.eliminarReporte(id_reporte);
    res.status(200).json({ message: "Reporte eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "No se pudo eliminar el reporte",
      error: error.message,
    });
  }
};

module.exports = controller;
