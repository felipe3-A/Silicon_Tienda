// controllers/valoresCaracteristicaController.js
const valoresCaracteristicaService = require("../services/valoresCaracteristicas");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ImagenService = require("../services/imagenService");
const SubModel = require("../models/subCaracteristica")

// Crear carpeta si no existe
const imagePathCaracteristica = path.join(
  __dirname,
  "../../images_caracteristica"
);
if (!fs.existsSync(imagePathCaracteristica)) {
  fs.mkdirSync(imagePathCaracteristica, { recursive: true });
}

// Configuración de almacenamiento de imágenes
const storageGalleryCaracteristica = multer.diskStorage({
  destination: imagePathCaracteristica,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadGalleriaCaracteristica = multer({
  storage: storageGalleryCaracteristica,
});

const controller = {};

controller.uploadImageCaracteristica = uploadGalleriaCaracteristica.single(
  "url_imagen_caracteristica"
);

controller.getAllValoresCaracteristicas = async (req, res) => {
  try {
    const valores = await valoresCaracteristicaService.getAllValoresCaracteristicas();
    if (!valores || valores.length === 0) {
      return res.status(404).json({ message: "No se encontraron datos" });
    }
    res.status(200).json({
      message: "Datos encontrados",
      data: valores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "No se pudo listar los valores de características",
      error: error.message,
    });
  }
};


controller.getValoresByProducto = (req, res) => {
  const { id_imagen } = req.params;
  valoresCaracteristicaService.getByProducto(id_imagen, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

controller.createValorCaracteristica = async (req, res) => {
  const {  id_subcaracteristica, valor } = req.body;

  // Verifica que  estos son estados estancados nesecito realizar estos canales de informacion que nesecitan esto, los paramentros parámetros requeridos estén presentes

  if (!id_subcaracteristica) {
    return res.status(400).json({ error: "El parámetro id_subcaracteristica es requerido." });
  }
  if (!valor) {
    return res.status(400).json({ error: "El parámetro valor es requerido." });
  }

  try {
    const nuevoValorCaracteristica = {
      id_imagen,
      id_subcaracteristica,
      valor,
      url_imagen: req.file ? `http://localhost:3000/uploads_caracteriticas/${req.file.filename}` : null
    };

    const result = await valoresCaracteristicaService.createValorCaracteristica(nuevoValorCaracteristica);
    
    res.status(201).json({
      message: "Valor de característica creado exitosamente",
      data: { id: result.insertId, ...nuevoValorCaracteristica },
    });

  } catch (error) {
    console.error("Error al crear el valor de característica:", error);
    res.status(500).json({
      message: "Error al crear el valor de característica",
      error: error.message,
    });
  }
};

module.exports =  controller