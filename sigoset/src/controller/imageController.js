const ImagenService = require("../services/imagenService");
const GrupoService = require("../services/grupoService");
const ValoresCaracteristica = require("../services/valoresCaracteristicas");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const imageModels = require("../models/imageModels");
const Imagen = require("../models/imageModels");

// Crear carpeta si no existe
const imagePath = path.join(__dirname, "../../images");
if (!fs.existsSync(imagePath)) {
  fs.mkdirSync(imagePath, { recursive: true });
}

const imagePathGallery = path.join(__dirname, "../../images_gallery");
if (!fs.existsSync(imagePathGallery)) {
  fs.mkdirSync(imagePathGallery, { recursive: true });
}

// Configuración de almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: imagePath,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configuración de almacenamiento de imágenes
const storageGallery = multer.diskStorage({
  destination: imagePathGallery,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
const uploadGalleria = multer({ storage: storageGallery });

const controller = {};

controller.uploadImage = upload.single("url_imagen");
controller.uploadGallery = uploadGalleria.array("url_imagenes", 5);

controller.crearImagen = async (req, res) => {
  const { id_galeria } = req.body;
  if (!id_galeria) {
    return res
      .status(400)
      .json({ error: "El parámetro id_galeria es requerido." });
  }

  try {
    const {
      nombre_producto,
      precio_producto,
      descripcion_producto,
      cantidad_producto,
      referencia_producto,
      garantia_producto,
      envio_producto,
      id_categoria,
      id_marca,
      id_grupo,
      id_galeria,
      estado_producto, // Cambié id por id_galeria
    } = req.body;

    if (!id_grupo) {
      return res
        .status(400)
        .json({ error: "El parámetro id_grupo es requerido." });
    }
    // Verificar si el ID de la galería existe
    if (!id_galeria) {
      // Validar id_galeria en lugar de id
      return res
        .status(400)
        .json({ error: "El parámetro id_galeria es requerido." });
    }

    if (!req.body) {
      // Validar id_galeria en lugar de id
      return res.status(400).json({ error: "El parámetro datos XD." });
    }

    // Llamada al servicio para verificar si la galería existe
    const galeria = await ImagenService.obttenerGaleriaId(id_galeria);
    console.log("Id CAPTURADO:", id_galeria);

    // Llamada al servicio para verificar si la galería existe
    const grupo = await GrupoService.obtenerGrupoId(id_grupo);
    console.log("Id GRUPOS :", id_grupo);

    // Usar id_galeria
    if (!galeria) {
      return res.status(404).json({ error: "La galería asociada no existe." });
    }
    if (!grupo) {
      return res.status(404).json({ error: "El Grupo asociado no existe." });
    }

    const url_imagen = req.file
      ? `http://localhost:3000/uploads/${req.file.filename}`
      : null;

    if (!req.file) {
      return res.status(400).json({ message: "La imagen es requerida." });
    }

    const nuevaImagen = {
      nombre_producto,
      precio_producto,
      descripcion_producto,
      cantidad_producto,
      referencia_producto,
      garantia_producto,
      envio_producto,
      id_categoria,
      id_marca,
      url_imagen,
      id_grupo,
      estado_producto,
      id_galeria, // Asociar la galería con id_galeria
    };

    // Guardar valores de características
    for (const caracteristica of productoData.caracteristicas) {
      await ValoresCaracteristica.create(
        result.insertId,
        caracteristica.id,
        caracteristica.valor,
        null
      ); // Ajusta según sea necesario
    }

    const result = await ImagenService.crearImagenConGaleria(nuevaImagen);

    res.status(201).json({
      message: "Imagen creada exitosamente",
      data: { id: result.insertId, ...nuevaImagen },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al crear la imagen", error: error.message });
  }
};

controller.listarImagenPorId = async (req, res) => {
  const { id_imagen } = req.params;

  try {
    const imagen = await imageModels.findByIdImage(id_imagen);
    if (!imagen) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }
    res.status(200).json(imagen);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener la imagen", error: error.message });
  }
};

controller.listarImagenes = async (req, res) => {
  try {
    const imageneslist = await ImagenService.listarImagenes();
    if (!imageneslist || imageneslist.length === 0) {
      return res.status(404).json({ message: "No se encontraron imágenes." });
    }
    res.status(200).json({
      message: "Imágenes listadas correctamente",
      data: imageneslist,
    });
  } catch (error) {
    res.status(500).json({
      message: "No se pudo listar las imágenes",
      error: error.message,
    });
  }
};

//Crear la galeria
// Función para cargar imágenes
// En tu controlador (imageController.js)
controller.uploadImages = async (req, res) => {
  try {
    const { titulo_grupo } = req.body;

    // Validar si hay imágenes cargadas
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Las imágenes son requeridas." });
    }

    // Crear URLs de las imágenes
    const url_imagenes = req.files.map(
      (file) => `http://localhost:3000/uploads_gallery/${file.filename}`
    );

    // Validar que el título exista
    if (!titulo_grupo) {
      return res.status(400).json({ message: "El título es requerido." });
    }

    // Crear la galería con las imágenes
    const nuevaGallery = {
      url_imagenes: JSON.stringify(url_imagenes), // Serializamos el array
      titulo_grupo,
    };

    const result = await ImagenService.crearGaleria(nuevaGallery);

    res.status(201).json({
      message: "Galería creada exitosamente",
      data: { id: result.insertId, ...nuevaGallery },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la galería", error: error.message });
  }
};

controller.listarImagenes = async (req, res) => {
  try {
    const imageneslist = await ImagenService.listarImagenes();
    if (!imageneslist || imageneslist.length === 0) {
      return res.status(404).json({ message: "No se encontraron imágenes." });
    }
    res.status(200).json({
      message: "Imágenes listadas correctamente",
      data: imageneslist,
    });
  } catch (error) {
    res.status(500).json({
      message: "No se pudo listar las imágenes",
      error: error.message,
    });
  }
};

controller.ListarGaleria = async (req, res) => {
  try {
    const images = await ImagenService.getGallery();
    res.status(200).json(images);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener las imágenes");
  }
};

// En imageController.js
controller.obtenerGaleriaPorId = async (req, res) => {
  const { id_galeria } = req.params; // Capturar el ID de la galería desde los parámetros de la URL

  try {
    // Llamar al servicio para obtener la galería por ID
    const galeria = await ImagenService.obttenerGaleriaId(id_galeria);

    if (!galeria) {
      return res
        .status(404)
        .json({ message: "No se encontró la galería con este ID." });
    }

    res.status(200).json({
      message: "Galería encontrada",
      data: galeria,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la galería",
      error: error.message,
    });
  }
};

controller.eliminarImagen = async (req, res, next) => {
  const id_imagen = req.params.id;
  try {
    await ImagenService.eliminarProducto(id_imagen); // Llamada al servicio
    res.status(200).json({
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "No se pudo eliminar el producto",
      error: error.message,
    });
  }
};

// Editar producto
controller.editarProducto = async (req, res, next) => {
  const { id_imagen } = req.params; // Asegúrate de que estás extrayendo el ID correctamente
  console.log("ID del producto:", id_imagen); // Verifica que el ID se esté recibiendo

  const {
      nombre_producto,
      precio_producto,
      descripcion_producto,
      cantidad_producto,
      referencia_producto,
      garantia_producto,
      envio_producto,
      id_categoria,
      id_marca,
      id_galeria,
      id_grupo,
      estado_producto,
  } = req.body;

  // Asegúrate de que el id_imagen sea válido
  if (!id_imagen) {
      return res.status(400).json({ message: "ID de imagen es requerido." });
  }

  const imagenesData = {};

  // Si se subió un nuevo archivo de imagen
  if (req.file) {
      imagenesData.url_imagen = `http://localhost:3000/uploads/${req.file.filename}`;
  }

  if (nombre_producto) {
      imagenesData.nombre_producto = nombre_producto;
  }
  if (precio_producto) {
      imagenesData.precio_producto = precio_producto;
  }
  if (descripcion_producto) {
      imagenesData.descripcion_producto = descripcion_producto;
  }
  if (cantidad_producto) {
      imagenesData.cantidad_producto = cantidad_producto;
  }
  if (referencia_producto) {
      imagenesData.referencia_producto = referencia_producto;
  }
  if (garantia_producto) {
      imagenesData.garantia_producto = garantia_producto;
  }
  if (envio_producto) {
      imagenesData.envio_producto = envio_producto;
  }
  if (id_categoria) {
      imagenesData.id_categoria = id_categoria;
  }
  if (id_marca) {
      imagenesData.id_marca = id_marca;
  }
  if (id_galeria) {
      imagenesData.id_galeria = id_galeria;
  }
  if (id_grupo) {
      imagenesData.id_grupo = id_grupo;
  }
if (estado_producto) {
      imagenesData.estado_producto = estado_producto;
  }

  // Si no se envió ningún dato para actualizar
  if (Object.keys(imagenesData).length === 0) {
      return res.status(400).json({ message: "No hay datos para actualizar." });
  }

  try {
      const resultado = await ImagenService.editarProducto(id_imagen, imagenesData);

      if (resultado.affectedRows === 0) {
          return res.status(404).json({ message: "No se encontró la imagen." });
      }

      res.status(200).json({
          message: "Imagen actualizada con éxito",
          data: imagenesData,
      });

  } catch (error) {
      console.error("Error al actualizar la imagen:", error);
      res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};
controller.listarImagenesPorCategoria = async (req, res) => {
  const { id_categoria } = req.params; // Obtener el id de la categoría desde los parámetros de la URL

  try {
    // Llamar al servicio para obtener las imágenes por categoría
    const [imagenes] = await ImagenService.listImagesByCategoria(id_categoria);

    if (!imagenes || imagenes.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron imágenes para esta categoría." });
    }

    res.status(200).json({
      message: "Imágenes encontradas para la categoría",
      data: imagenes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al listar las imágenes por categoría",
      error: error.message,
    });
  }
};

controller.listarImagenesPorMarca = async (req, res) => {
  const { id_marca } = req.params; // Obtener el id de la categoría desde los parámetros de la URL

  try {
    // Llamar al servicio para obtener las imágenes por categoría
    const [imagenes] = await ImagenService.listImagesByMarca(id_marca);

    if (!imagenes || imagenes.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron imágenes para esta marca." });
    }

    res.status(200).json({
      message: "Imágenes encontradas para la marca",
      data: imagenes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al listar las imágenes por marca",
      error: error.message,
    });
  }
};

controller.listarImagenesPorGrupo = async (req, res) => {
  const { id_grupo } = req.params; // Obtener el id del grupo desde los parámetros de la URL

  try {
    // Llamar al servicio para obtener las imágenes por grupo
    const [imagenes] = await ImagenService.listImagesByGroup(id_grupo);

    if (!imagenes || imagenes.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron imágenes para este grupo." });
    }

    res.status(200).json({
      message: "Imágenes encontradas para el grupo",
      data: imagenes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al listar las imágenes por grupo",
      error: error.message,
    });
  }
};
module.exports = controller;
