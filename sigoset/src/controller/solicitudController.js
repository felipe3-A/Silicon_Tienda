// controllers/SolicitudController.js
const SolicitudService = require("../services/SolicitudService");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Marca = require("../models/marcaModel");
const { Usuario } = require("../models/UsuarioModel");
const Servicio = require("../models/tipoServicioModel");
const TipoArticulo = require("../models/tipoArticuloModel");
const { error } = require("console");
const Solicitud = require("../models/SolicitudModel");

// Crear carpeta si no existe, para guardar las imágenes de las solicitudes
const imagePath = path.join(__dirname, "../../images_solicitud");
if (!fs.existsSync(imagePath)) {
  fs.mkdirSync(imagePath, { recursive: true });
}

// Configuración de almacenamiento de imágenes
const storageSolicitud = multer.diskStorage({
  destination: imagePath,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadSolicitud = multer({ storage: storageSolicitud });

const controller = {};

// Middleware para subir imágenes
controller.uploadImagesSolicitudes = uploadSolicitud.array(
  "url_imagenes_solicitud",
  5
);

// Crear una nueva solicitud
controller.crearSolicitud = async (req, res) => {
  try {
    const {
      titulo_galeria,
      descripcion_falla,
      fecha_compra,
      fecha_vendimiento_garantia,
      numero_factura,
      numero_garantia,
      garantia_producto,
      tipo_solicitud,
      id_marca,
      id_tipo_servicio,
      id_tipo_articulo,
      id,
      id_galeria_Solicitud,
    } = req.body;

    // Validación de campos requeridos
    const requiredFields = [
      { name: "descripcion_falla", value: descripcion_falla },
      { name: "fecha_compra", value: fecha_compra },
      { name: "fecha_vendimiento_garantia", value: fecha_vendimiento_garantia },
      { name: "numero_factura", value: numero_factura },
      { name: "numero_garantia", value: numero_garantia },
      { name: "garantia_producto", value: garantia_producto },
      { name: "tipo_solicitud", value: tipo_solicitud },
      { name: "id_marca", value: id_marca },
      { name: "id_tipo_servicio", value: id_tipo_servicio },
      { name: "id_tipo_articulo", value: id_tipo_articulo },
      { name: "id", value: id },
      { name: "id_galeria_Solicitud", value: id_galeria_Solicitud },
    ];

    // Verificar si hay campos requeridos vacíos
    const missingFields = requiredFields.filter(field => !field.value);
    if (missingFields.length > 0) {
      missingFields.forEach(field => {
        console.log(`El campo ${field.name} es requerido.`);
      });
      return res.status(400).json({ message: "Faltan campos requeridos." });
    }

    // Llamada al servicio para verificar si la galería existe
    const galeriaSolicitud = await SolicitudService.obttenerGaleriaSolicitudId(
      id_galeria_Solicitud
    );
    console.log("Id CAPTURADO de la galeria :", id_galeria_Solicitud);
    if (!galeriaSolicitud) {
      return res.status(404).json({ error: "La galería asociada no existe." });
    }

    // Llamada al servicio para verificar si la marca existe
    const marcaSolicitud = await Marca.findById(id_marca);
    console.log("Id CAPTURADO de la marca:", id_marca);
    if (!marcaSolicitud) {
      return res.status(404).json({ error: "La marca asociada no existe." });
    }

    // Llamada al servicio para verificar si el usuario existe
    const usuarioSolicitud = await Usuario.findById(id);
    console.log("Id CAPTURADO del usuario:", id);
    if (!usuarioSolicitud) {
      return res.status(404).json({ error: "El usuario asociado no existe." });
    }

    // Llamada al servicio para verificar si el servicio existe
    const servicioSolicitud = await Servicio.findByIdService(id_tipo_servicio);
    console.log("Id CAPTURADO del tipo de Servicio:", id_tipo_servicio);
    if (!servicioSolicitud) {
      return res.status(404).json({ error: "El Servicio asociado no existe." });
    }

    // Llamada al servicio para verificar si el tipo de artículo existe
    const tipoArticuloSolicitud = await TipoArticulo.findByIdTipoArticulo(
      id_tipo_articulo
    );
    console.log("Id CAPTURADO del tipo de Articulo:", id_tipo_articulo);
    if (!tipoArticuloSolicitud) {
      return res
        .status(404)
        .json({ error: "El tipo de Articulo asociado no existe." });
    }

    const nuevaSolicitud = {
      titulo_galeria,
      descripcion_falla,
      fecha_compra,
      fecha_vendimiento_garantia,
      numero_factura,
      numero_garantia,
      garantia_producto,
      tipo_solicitud,
      id_marca,
      id_tipo_servicio,
      id_tipo_articulo,
      id,
      id_galeria_Solicitud,
    };
    const result = await SolicitudService.crearSolicitud(nuevaSolicitud);

    res.status(201).json({
      message: "Solicitud creada exitosamente",
      data: { id: result.insertId, ...nuevaSolicitud },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al crear la solicitud", error: error.message });
  }
};

// Listar todas las solicitudes
controller.listarSolicitudes = async (req, res) => {
  try {
    const solicitudes = await SolicitudService.listarSolicitudes();
    res.status(200).json({
      message: "Solicitudes listadas correctamente",
      data: solicitudes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al listar las solicitudes",
      error: error.message,
    });
  }
};

// Obtener solicitud por ID
controller.listarSolicitudPorId = async (req, res) => {
  const { id_solicitud } = req.params;

  try {
    const [solicitud] = await SolicitudService.listSolicitudById(id_solicitud);
    if (!solicitud || solicitud.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró la solicitud con este ID." });
    }

    res.status(200).json({
      message: "Solicitud encontrada",
      data: solicitud[0],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la solicitud", error: error.message });
  }
};

// Eliminar solicitud
controller.eliminarSolicitud = async (req, res) => {
  const { id_solicitud } = req.params;

  try {
    await SolicitudService.eliminarSolicitud(id_solicitud);
    res.status(200).json({ message: "Solicitud eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la solicitud",
      error: error.message,
    });
  }
};

controller.uploadImagesGalleySolicitud = async (req, res) => {
  try {
    const { titulo_galeria } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Las imágenes son requeridas." });
    }

      // Crear URLs de las imágenes
      const url_imagenes_solicitud = req.files.map(
        (file) => `http://localhost:3000/uploads_solicitud/${file.filename}`
      );
  
 

  
    // Validar que el título exista
    if (!titulo_galeria) {
      return res.status(400).json({ message: "El título es requerido." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Las imágenes son requeridas." });
    }

    // Crear la galería con las imágenes
    const nuevaGallery = {
      url_imagenes_solicitud: JSON.stringify(url_imagenes_solicitud), // Serializamos el array
      titulo_galeria,
    };

    const result = await SolicitudService.crearGaleriaSolicitud(nuevaGallery);

    res.status(201).json({
      message: "Galería de solicitud creada exitosamente",
      data: { id: result.insertId, ...nuevaGallery },
    });
  } catch (error) {
    console.log(error);
    
    res
      .status(500)
      .json({ message: "Error al crear la galería", error: error.message });
  }
};

controller.ListarGaleriaSolicitudes = async (req, res) => {
  try {
    const imagesSolicitudes = await SolicitudService.getGallerySolicitudes();
    res.status(200).json(imagesSolicitudes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener la galeria de imagnes");
  }
};

// Listar los tipod de articulos y el tipo de Servicio
// Listar todas las solicitudes
controller.ListarTipoArticulos = async (req, res) => {
  try {
    const TipoArticulo = await SolicitudService.listarTipoArticulos();
    res.status(200).json({
      message: "Tipo de Articulos listadas correctamente",
      data: TipoArticulo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al listar los Articulos",
      error: error.message,
    });
  }
};


controller.ListarTipoServicio = async (req, res) => {
  try {
    const tipoServicio = await SolicitudService.listarTipodeServicio();
    res.status(200).json({
      message: "Tipo de Servicios listadas correctamente",
      data: tipoServicio,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al listar los Articulos",
      error: error.message,
    });
  }
};


module.exports = controller;
