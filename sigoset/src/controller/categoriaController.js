const Categoria = require("../services/categoriaService");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//Crear la carpetad imagenes para las marcas

// Crear carpeta si no existe
const imagePath = path.join(__dirname, "../../images_categorias");
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

controller.uploadImage = upload.single("logo_categoria",); // el nombre logo_marca es la casilla que recibe la imagen en la bse de datos

controller.crearCategoria = async (req, res) => {
  try {
    console.log("Datos recibidos en req.body:", req.body);
    const { categoria } = req.body;
    const logo_categoria = req.file
      ? `http://localhost:3000/uploads_categoria/${req.file.filename}`
      : null;

    if (!req.file) {
      return res.status(400).json({ message: "La imagen es requerida." });
    }

    if (!categoria) {
      return res.status(400).json({ message: "La categoría es requerida." });
    }
    console.log("Ruta de la imagen guardada:", logo_categoria);
    console.log("Archivo recibido:", req.file);

    const nuevaCategoria = { categoria, logo_categoria };
    const result = await Categoria.crearCategoria(nuevaCategoria);

    res.status(201).json({
      message: "Categoría creada exitosamente",
      data: { id: result.insertId, ...nuevaCategoria },
    });
  } catch (error) {
    console.error("Error en crearCategoria:", error.message);
    res
      .status(500)
      .json({ message: "Error al crear la categoría", error: error.message });
  }
};

// Listar todas las categorias
controller.listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.listarCategorias();

    if (!categorias || categorias.length === 0) {
      return res.status(404).json({ message: "No se encontraron categorias." });
    }

    res.status(200).json({
      message: "Categorias listadas correctamente",
      data: categorias,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al listar las Categorias",
      error: error.message,
    });
  }
};
// Listar productos por categoria
// Controlador para listar categorías con productos
controller.listarCategoriasConProductos = async (req, res) => {
  try {
    const categorias = await Categoria.listarCategorias();

    if (!categorias || categorias.length === 0) {
      return res.status(404).json({ message: "No se encontraron categorías." });
    }

    // Para cada categoría, obtener los productos asociados
    const categoriasConProductos = await Promise.all(categorias.map(async (categoria) => {
      const productos = await Categoria.listarrProductoCategoria(categoria.id_categoria);
      return {
        ...categoria,
        productos: productos || [] // Agregar productos a la categoría
      };
    }));

    res.status(200).json({
      message: "Categorías y productos listados correctamente",
      data: categoriasConProductos,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al listar las categorías y productos",
      error: error.message,
    });
  }
};

// Editar categorias

// Controlador para editar una categoría
controller.editarCategoria = async (req, res) => {
  const { id_categoria } = req.params;
  const { categoria } = req.body;

  console.log("categoria recibida:", categoria); // Esto te ayudará a verificar el valor

  // Asegúrate de que los datos se reciban correctamente
  if (!categoria) {
    return res
      .status(400)
      .json({ message: "El campo categoría es obligatorio." });
  }

  try {
    const categoriaActualizada = await Categoria.editarCategoria(id_categoria, {
      categoria,
    });

    if (!categoriaActualizada) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    res.status(200).json({
      message: "Categoría actualizada correctamente",
      data: categoriaActualizada,
    });
  } catch (error) {
    console.error("Error en editarCategoria:", error.message);
    res.status(500).json({
      message: "Error al actualizar la categoría",
      error: error.message,
    });
  }
};

// Eliminar categoria
controller.eliminarCategoria = async (req, res) => {
  const idCategoria = req.params.id;

  try {
    await Categoria.eliminarCategoria(idCategoria);
    res.status(200).json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la categoría",
      error: error.message,
    });
  }
};

module.exports = controller;
