const Cart = require("../models/cartModel");
const ProductosCarritoService = require("../services/cartProductsServices");
const Imagen = require("../models/imageModels"); // Asegúrate de importar correctamente todos los servicios

const controller = {};

controller.addProductToCart = async (req, res) => {
  const { carrito_id, id_imagen, cantidad, precio } = req.body;

  // Validar campos requeridos
  if (!carrito_id) {
    return res.status(400).json({ error: "Faltan parámetros: carrito_id." });
  }
  if (!id_imagen) {
    return res.status(400).json({ error: "Faltan parámetros: id_imagen." });
  }
  if (!cantidad) {
    return res.status(400).json({ error: "Faltan parámetros: cantidad." });
  }
  if (!precio) {
    return res.status(400).json({ error: "Falta precio." });
  }

  try {
    // Verificar que el carrito existe
    const carrito = await Cart.findByCartId(carrito_id);
    if (!carrito.length) { // Cambiado para verificar si el carrito existe
      return res.status(404).json({ error: `El carrito con ID ${carrito_id} no existe.` });
    }

    // Verificar que el producto existe
    const producto = await Imagen.findByIdImage(id_imagen);
    if (!producto) {
      return res.status(404).json({ error: `El producto con ID ${id_imagen} no existe.` });
    }

    // Finalizar envío de datos después de haberlos verificado
    const result = await ProductosCarritoService.addProductToCart(carrito_id, id_imagen, cantidad, precio);
    res.status(200).json({
      message: "Producto agregado al carrito",
      data: result,
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      message: "Error al agregar el producto al carrito",
      error: error.message,
      data:result
    });
  }
};
controller.removeProductFromCart = async (req, res) => {
  const { carrito_id, id_imagen } = req.body;

  if (!carrito_id || !id_imagen) {
    return res.status(400).json({ error: "Faltan parámetros requeridos." });
  }

  try {
    const result = await ProductosCarritoService.removeProductFromCart(carrito_id, id_imagen);
    res.status(200).json({
      message: "Producto eliminado del carrito",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el producto del carrito",
      error: error.message,
    });
  }
};

controller.getProductsInCart = async (req, res) => {
  const { id_carrito } = req.params; // Cambia 'cart_id' a 'id_carrito' para que coincida con la ruta

  // Validar que se haya proporcionado el id_carrito
  if (!id_carrito) {
    return res.status(400).json({ error: "Falta el parámetro: id_carrito." });
  }

  try {
    // Obtener los productos en el carrito
    const products = await ProductosCarritoService.getProductsInCart(id_carrito);
    
    // Verificar si se encontraron productos
    if (products.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos en el carrito." });
    }

    res.status(200).json({
      message: "Productos encontrados en el carrito",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los productos del carrito",
      error: error.message,
    });
  }
};

module.exports = controller;