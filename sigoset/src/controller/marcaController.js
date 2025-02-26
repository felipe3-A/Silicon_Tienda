const Marca = require("../services/marcaService");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


//Crear la carpetad imagenes para las marcas 

// Crear carpeta si no existe
const imagePath = path.join(__dirname, "../../images_marcas");
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

controller.uploadImage = upload.single("logo_marca"); // el nombre logo_marca es la casilla que recibe la imagen en la bse de datos

// Crear nueva marca
controller.crearMarca = async (req, res) => {
    try {
      console.log(req.file); // Añade esto para depurar
      const { marca } = req.body;
      const logo_marca = req.file
        ? `http://localhost:3000/uploads_marca/${req.file.filename}`
        : null;
      
      if (!req.file) {
        return res.status(400).json({ message: "La imagen es requerida." });
      }
  
      if (!marca) {
        return res.status(400).json({ message: "El nombre de la marca es obligatorio." });
      }
  
      const nuevaMarca = { marca, logo_marca };
      const result = await Marca.crearMarca(nuevaMarca);
  
      res.status(201).json({
        message: "Marca creada exitosamente",
        data: { id: result.insertId, ...nuevaMarca },
      });
    } catch (error) {
      console.error(error); // Añade esto para capturar el error
      res.status(500).json({ message: "Error al crear la marca", error: error.message });
    }
  };
  
// Listar todas las marcas
controller.listarMarcas = async (req, res) => {
  try {
    const marcas = await Marca.listarMarcas();

    if (!marcas || marcas.length === 0) {
      return res.status(404).json({ message: "No se encontraron marcas." });
    }

    res.status(200).json({
      message: "Marcas listadas correctamente",
      data: marcas,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al listar las marcas",
      error: error.message,
    });
  }
};


// Obtener una marca por su ID
controller.listarMarcaPorId = async (req, res) => {
  const idMarca = req.params.id;
  try {
    const marca = await Marca.listarProductoMarca(idMarca);

    if (!marca) {
      return res.status(404).json({ message: "Marca no encontrada." });
    }

    res.status(200).json({
      message: "Marca obtenida correctamente",
      data: marca,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la marca",
      error: error.message,
    });
  }
};

// Listar productos por marca
controller.listarProductoMarca = async (req, res) => {
  const idMarca = req.params.id;
  try {
    const productos = await Marca.listarProductoMarca(idMarca);

    if (!productos || productos.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos para esta marca." });
    }

    res.status(200).json({
      message: "Productos listados correctamente",
      data: productos,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al listar productos por marca",
      error: error.message,
    });
  }
};

// Editar marca
controller.editarMarca = async (req, res) => {
  const idMarca = req.params.id;
  const nuevaMarca = req.body;

  try {
    const marcaActualizada = await Marca.editarProducto(idMarca, nuevaMarca);

    res.status(200).json({
      message: "Marca editada correctamente",
      data: marcaActualizada,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al editar la marca",
      error: error.message,
    });
  }
};

// Eliminar marca
controller.eliminarMarca = async (req, res) => {
  const idMarca = req.params.id;

  try {
    await Marca.eliminarMarca(idMarca);

    res.status(200).json({
      message: "Marca eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la marca",
      error: error.message,
    });
  }
};

module.exports = controller;
