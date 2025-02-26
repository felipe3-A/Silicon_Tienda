const Cart = require("../models/cartModel");

const createCart = async (user_id, estado, fecha_creacion) => {
  try {
    const result = await Cart.createCart(user_id, estado, fecha_creacion);
    return result; // Devuelve el resultado directamente
  } catch (error) {
    throw error;
  }
};

//Listar los produtos con si¿u info de un carrito
const cartProductService = async(cartId)=>{
 
    try {
      const products = await Cart.getProductsByCartId(cartId);
      return products;
    } catch (error) {
      throw new Error("Error al obtener los productos del carrito: " + error.message);
    }
  
};


const getCartByUser   = async (usuario_id) => {
  try {
      const cart = await Cart.findByUser (usuario_id);
      if (!cart) { // Cambia esto para verificar si cart es null
          throw new Error("Este usuario no tiene carrito registrado.");
      }
      return cart; // Regresa el carrito del usuario
  } catch (error) {
      throw error;
  }
};

const obtenerUsuarioId = async (usuario_id) => {
  try {
    const usuario = await Cart.findByUser(usuario_id);  // Obtener usuario por ID
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return usuario;  // Retorna el producto encontrado
  } catch (error) {
    throw error;
  }
};

const addProductToCart = async (user_id, product_id, quantity) => {
  try {
    const cart = await getCartByUser (user_id); // Obtenemos el carrito del usuario

    // Verificamos si el producto ya está en el carrito
    const existingItem = await Cart.findCartItem(cart.id, product_id);
    if (existingItem.length > 0) {
      // Si el producto ya está en el carrito, actualizamos la cantidad
      return await Cart.updateCartItem(cart.id, product_id, quantity);
    } else {
      // Si el producto no está en el carrito, lo agregamos
      return await Cart.addProductToCart(cart.id, product_id, quantity);
    }
  } catch (error) {
    throw error;
  }
};

const removeProductFromCart = async (user_id, product_id) => {
  try {
    const cart = await getCartByUser (user_id); // Obtenemos el carrito del usuario
    return await Cart.removeProductFromCart(cart.id, product_id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCart,
  getCartByUser ,
  addProductToCart,
  removeProductFromCart,
  obtenerUsuarioId,
  cartProductService
  
};