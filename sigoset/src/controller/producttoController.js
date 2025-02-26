const { 
  crearProducto, 
  obtenerProductoId, 
  eliminarProducto, 
  editarProducto, 
  listarProductos 
} = require('../services/productoService');
const path = require('path');
const upload = require('../uploads/uploads')

const controller = {};

// Listar productos
controller.listarProductos = 
async (req, res, next) => {
  try {
    const productosList = await listarProductos(); // Llamada al servicio
    res.status(200).json({
      message: 'Productos listados correctamente',
      data: productosList,
    });
  } catch (error) {
    res.status(500).json({
      message: 'No se pudo listar los productos',
      error: error.message,
    });
  }
};

// Crear producto
controller.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio,cantidad,referencia,categoria,garantia,marca,envio,proovedor,recepcion } = req.body;
    const imagen = req.file ? req.file.filename : null;
  
    if (!imagen) {
      return res.status(400).json({ message: "La imagen del producto es requerida." });
    }
    const nuevoProducto = { 
      nombre, 
      descripcion, 
      precio, 
      imagen,
      cantidad,
      referencia,
      categoria,
      garantia,
      marca,
      envio,
      proovedor,
      recepcion  // `http://localhost:3000/uploads/${imagen}` // URL completa de la imagen
    };

    const product = await crearProducto(nuevoProducto); // Llamada al servicio

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al crear el producto',
      error: error.message,
    });
  }
};

// Obtener producto por ID
controller.obtenerProductoId = async (req, res, next) => {
  const idProducto = req.params.id;
  try {
    const producto = await obtenerProductoId(idProducto);  // Llamada al servicio
    res.status(200).json({
      message: 'Producto obtenido correctamente',
      data: producto,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener el producto',
      error: error.message,
    });
  }
};

// Eliminar producto por ID
controller.eliminarProducto = async (req, res, next) => {
  const idProducto = req.params.id;
  try {
    await eliminarProducto(idProducto);  // Llamada al servicio
    res.status(200).json({
      message: 'Producto eliminado correctamente',
    });
  } catch (error) {
    res.status(500).json({
      message: 'No se pudo eliminar el producto',
      error: error.message,
    });
  }
};

// Editar producto
controller.editarProducto = async (req, res, next) => {
  const idProducto = req.params.id;
  const nuevoProducto = req.body;

  try {
    const productoActualizado = await editarProducto(idProducto, nuevoProducto); // Llamada al servicio
    res.status(200).json({
      message: 'Producto editado correctamente',
      data: productoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al editar el producto',
      error: error.message,
    });
  }
};

module.exports = controller;
