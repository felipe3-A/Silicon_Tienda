const Cart = require("../models/cartModel");
const { Usuario } = require("../models/UsuarioModel");
const CartService = require("../services/cartService");

const controller = {};

controller.createCart = async (req, res) => {
  const { usuario_id, estado } = req.body;

  if (!usuario_id) {
    return res.status(400).json({ error: "El parámetro usuario_id es requerido." });
  }

  try {
    const usuario = await CartService.obtenerUsuarioId(usuario_id); // Verifica si el usuario existe

    if (!usuario) { 
      return res.status(404).json({ error: `El usuario con ID ${usuario_id} no existe.` });
    }

    const estadoFinal = estado || 'CREATED';
    const fecha_creacion = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formato "YYYY-MM-DD HH:MM:SS"

    const cart = await CartService.createCart(usuario_id, estadoFinal, fecha_creacion);

    res.status(201).json({
      message: "Carrito creado exitosamente",
      data: cart, // Asegúrate de que esto sea el resultado correcto
    });
  } catch (error) {
    console.error("Error al crear el carrito:", error.message);
    res.status(500).json({
      message: "Error al crear el carrito",
      error: error.message,
    });
  }
};

controller.getCart = async (req, res) => {
  const { usuario_id } = req.params;

  if (!usuario_id) {
    return res.status(400).json({ error: "El parámetro usuario_id es requerido." });
  }
  try {
    const cart = await CartService.getCartByUser(usuario_id);
    res.status(200).json({
      message: "Carrito encontrado",
      data: cart,
    });
  } catch (error) {
    console.log("Error :",error);
    
    res.status(500).json({
      message: "Error al obtener el carrito",
      error: error.message,
    });
  }
};

// Listar productos del carrito
controller.listProducts = async (req, res) => {
  const { cartId } = req.params; // Obtener el ID del carrito desde los parámetros de la solicitud

  if (!cartId) {
    return res.status(400).json({ error: "El parámetro cartId es requerido." });
  }

  try {
    const products = await CartService.cartProductService(cartId);
    res.status(200).json({
      message: "Productos del carrito obtenidos exitosamente",
      data: products,
    });
  } catch (error) {
    console.error("Error al listar productos del carrito:", error);
    res.status(500).json({
      message: "Error al listar productos del carrito",
      error: error.message,
    });
  }
};



controller.addProductToCart = async (req, res) => {
  const { usuario_id, product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: "Faltan parámetros requeridos." });
  }

  try {
    const result = await CartService.addProductToCart(usuario_id, product_id, quantity);
    res.status(200).json({
      message: "Producto agregado al carrito",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar el producto al carrito",
      error: error.message,
    });
  }
};

controller.removeProductFromCart = async (req, res) => {
  const { usuario_id, product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({ error: "El parámetro product_id es requerido." });
  }

  try {
    const result = await CartService.removeProductFromCart(usuario_id, product_id);
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

module.exports = controller;