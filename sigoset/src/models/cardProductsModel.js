const pool = require("../config/database");

const ProductosCarrito = {
  async findByCartId(cart_id) {
    const sql = `
      SELECT 
        pc.id,
        pc.carrito_id,
        pc.id_imagen,
        pc.cantidad,
        pc.precio,
        img.url_imagen,
        img.nombre_producto,
        img.descripcion_producto,
        img.precio_producto,
        img.cantidad_producto,
        img.referencia_producto,
        img.garantia_producto,
        img.envio_producto
      FROM productos_carrito pc
      INNER JOIN imagenes img ON pc.id_imagen = img.id_imagen
      WHERE pc.carrito_id = ?
    `;
    const [rows] = await pool.execute(sql, [cart_id]);
    return rows; // Regresa los productos con información de la imagen
  },

  async addProductToCart(cart_id, id_imagen, cantidad, precio) {
    const sql = `INSERT INTO productos_carrito (carrito_id, id_imagen, cantidad, precio) VALUES (?, ?, ?, ?)`;
    return pool.execute(sql, [cart_id, id_imagen, cantidad, precio]);
  },

  async updateProductInCart(cart_id, id_imagen, cantidad) {
    const sql = `UPDATE productos_carrito SET cantidad = ? WHERE carrito_id = ? AND id_imagen = ?`;
    return pool.execute(sql, [cantidad, cart_id, id_imagen]);
  },

  async removeProductFromCart(cart_id, id_imagen) {
    const sql = `DELETE FROM productos_carrito WHERE carrito_id = ? AND id_imagen = ?`;
    return pool.execute(sql, [cart_id, id_imagen]);
  },
};

module.exports = ProductosCarrito;
