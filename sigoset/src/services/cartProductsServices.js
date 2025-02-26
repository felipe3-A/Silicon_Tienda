const ProductosCarrito = require("../models/cardProductsModel");

const addProductToCart = async (cart_id, id_imagen, cantidad, precio) => {
  try {
    const existingItem = await ProductosCarrito.findByCartId(cart_id);
    const productInCart = existingItem.find(item => item.id_imagen === id_imagen);

    if (productInCart) {
      // Si el producto ya está en el carrito, actualizamos la cantidad
      return await ProductosCarrito.updateProductInCart(cart_id, id_imagen, productInCart.cantidad + cantidad);
    } else {
      // Si el producto no está en el carrito, lo agregamos
      return await ProductosCarrito.addProductToCart(cart_id, id_imagen, cantidad, precio);
    }
  } catch (error) {
    throw error;
  }
};

const removeProductFromCart = async (cart_id, id_imagen) => {
  try {
    return await ProductosCarrito.removeProductFromCart(cart_id, id_imagen);
  } catch (error) {
    throw error;
  }
};

const getProductsInCart = async (cart_id) => {
  try {
    return await ProductosCarrito.findByCartId(cart_id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addProductToCart,
  removeProductFromCart,
  getProductsInCart,
};