const ImgPublicidadService = require("../services/imgPublicidadService");
const ImageModel = require("../models/imgPublicidadModel")

const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Crear carpeta si no existe
const imagePath = path.join(__dirname, "../../images_publicidad");
const Tipo = require("../models/tipoModel");

if (!fs.existsSync(imagePath)) {
  fs.mkdirSync(imagePath, { recursive: true });
}

// Configuración de almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: imagePath,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
const controller = {};

controller.uploadImage = upload.single("url_imagen_publicitaria"); //Nombre de casilla en la db

controller.crearImgPublicidad = async (req, res) => {
  try {
    const { nombre_imagen_publicitaria, id_tipo_imagen, id_grupo, id_categoria, id_imagen } = req.body;
    const url_imagen_publicitaria = req.file
      ? `http://localhost:3000/uploads_publicidad/${req.file.filename}`
      : null;

    // Verifica que la imagen sea obligatoria
    if (!req.file) {
      return res.status(400).json({ message: "La imagen es requerida." });
    }
    if (!nombre_imagen_publicitaria) {
      return res.status(400).json({ message: "El nombre de la imagen es requerido." });
    }
    if (!id_tipo_imagen) {
      return res.status(400).json({ message: "El tipo de imagen es requerido." });
    }

    // Verificar que al menos uno de los tres IDs esté presente
    const ids = [id_grupo, id_categoria, id_imagen].filter(id => id !== undefined && id !== null);
    
    if (ids.length === 0) {
      return res.status(400).json({ message: "Debe enviar al menos uno de los siguientes: id_grupo, id_categoria o id_imagen." });
    }
    if (ids.length > 1) {
      return res.status(400).json({ message: "Solo puede enviar uno de los siguientes: id_grupo, id_categoria o id_imagen." });
    }

    const nuevaImagenPub = {
      url_imagen_publicitaria,
      id_tipo_imagen,
      nombre_imagen_publicitaria,
      id_grupo: id_grupo || null,
      id_categoria: id_categoria || null,
      id_imagen: id_imagen || null
    };

    const result = await ImgPublicidadService.crearImagenPublicidad(nuevaImagenPub);

    res.status(201).json({
      message: "Publicidad creada exitosamente",
      data: { id: result.insertId, ...nuevaImagenPub },
    });

  } catch (error) {
    res.status(500).json({ message: "Error al crear la publicidad", error: error.message });
    console.log(error);
  }
};


controller.listarImagenesPub = async (req, res) => {
  try {
    const imagenesPublist =
      await ImgPublicidadService.listarImagenesPublicitarias();
    if (!imagenesPublist || imagenesPublist.length === 0) {
      return res.status(404).json({ message: "No se encontraron imágenes." });
    }
    res.status(200).json({
      message: "Publicidad Imágenes listadas correctamente",
      data: imagenesPublist,
    });
  } catch (error) {
    res.status(500).json({
      message: "No se pudo listar las imágenes",
      error: error.message,
    });
  }
};

controller.eliminarImagenPub = async (req, res, next) => {
  const idImagenPub = req.params.id;
  try {
    await ImgPublicidadService.eliminarProductoPublicidad(idImagenPub); // Llamada al servicio
    res.status(200).json({
      message: "Imagen eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "No se pudo eliminar el Imagen",
      error: error.message,
    });
  }
};

// Listar imagenes por tipo
controller.listarimagenportipo = async (req, res) => {
  const { idTipo } = req.params;
  try {
    const [imagesPub] = await ImgPublicidadService.listImagesPubByType(
        idTipo
    );

    if (!imagesPub || imagesPub.length === 0) {
      return res.status(404).json({
        message: "No se encontraron imagenesPubxTipe para esta tipo.",
      });
    }

    res.status(200).json({
      message: "Imagenes listados correctamente",
      data: imagesPub,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error al listar Imagenes por tipo",
      error: error.message,
      
    });
  }
};

controller.obtenerImagenPublicidad = async (req, res) => {
  const { id } = req.params;

  try {
    const imagenPublicidad = await ImgPublicidadService.obtenerImagenPublicidadPorId(id);

    if (!imagenPublicidad || imagenPublicidad.length === 0) {
      return res.status(404).json({
        message: "No se encontró ninguna imagen publicitaria con ese ID."
      });
    }

    res.status(200).json({
      message: "Imagen publicitaria encontrada.",
      data: imagenPublicidad
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la imagen publicitaria",
      error: error.message
    });
  }
};


controller.actualizarImagenPublicidad = async (req, res) => {
  const { id_imagen_publicitaria } = req.params;

  console.log("ID RECIBIDO ", id_imagen_publicitaria);
  
  // Extraer solo los campos que se envían en el cuerpo de la solicitud
  const {
      nombre_imagen_publicitaria,
      id_tipo_imagen,
      id_grupo,
      id_categoria,
      id_imagen
  } = req.body;

  // Verificar que el ID no sea nulo
  if (!id_imagen_publicitaria) {
      return res.status(400).json({ message: "ID de imagen publicitaria es requerido." });
  }

  // Crear objeto de actualización solo con valores definidos
  const imagenes_publicitariasData = {};
  
  if (req.file) {
      imagenes_publicitariasData.url_imagen_publicitaria = `http://localhost:3000/uploads_publicidad/${req.file.filename}`;
  }
  if (nombre_imagen_publicitaria) {
      imagenes_publicitariasData.nombre_imagen_publicitaria = nombre_imagen_publicitaria;
  }
  if (id_tipo_imagen) {
      imagenes_publicitariasData.id_tipo_imagen = id_tipo_imagen;
  }
  if (id_grupo) {
      imagenes_publicitariasData.id_grupo = id_grupo;
  }
  if (id_categoria) {
      imagenes_publicitariasData.id_categoria = id_categoria;
  }
  if (id_imagen) {
      imagenes_publicitariasData.id_imagen = id_imagen;
  }

  // Si no se envió ningún dato para actualizar
  if (Object.keys(imagenes_publicitariasData).length === 0) {
      return res.status(400).json({ message: "No hay datos para actualizar." });
  }

  try {
      const resultado = await ImgPublicidadService.actualizarImagenPublicidad(id_imagen_publicitaria, imagenes_publicitariasData);

      if (resultado.affectedRows === 0) {
          return res.status(404).json({ message: "No se encontró la imagen publicitaria." });
      }

      res.status(200).json({
          message: "Imagen publicitaria actualizada con éxito",
          data: imagenes_publicitariasData,
      });

  } catch (error) {
      console.error("Error al actualizar la imagen publicitaria:", error);
      res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};



module.exports = controller;
