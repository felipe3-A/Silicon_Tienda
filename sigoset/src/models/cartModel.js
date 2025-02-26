const pool = require("../config/database");

const Cart = {
  async findCartItem(cart_id, product_id) {
    const sql = `SELECT * FROM carrito_productos WHERE id_carrito = ? AND id_producto = ?`;
    const [rows] = await pool.execute(sql, [cart_id, product_id]);
    return rows;
  },

  async findByCartId(cart_id) {
    const sql = `SELECT * FROM carrito WHERE id = ?`;
    const [rows] = await pool.execute(sql, [cart_id]);
    return rows; // Regresa los productos del carrito
  },
  //Listar info de los productos de un carrito
  async getProductsByCartId(cartId) {
    const sql = `
    SELECT pc.id, pc.carrito_id, pc.id_imagen, pc.cantidad, pc.precio, i.nombre_producto, i.descripcion_producto
    FROM productos_carrito pc
    JOIN imagenes i ON pc.id_imagen = i.id_imagen
    WHERE pc.carrito_id = ?`;

    const [rows] = await pool.execute(sql, [cartId]);
    return rows;
  },

  async addProductToCart(cart_id, product_id, quantity) {
    const sql = `INSERT INTO carrito_productos (id_carrito, id_producto, cantidad) VALUES (?, ?, ?)`;
    return pool.execute(sql, [cart_id, product_id, quantity]);
  }, 

  

  async updateCartItem(cart_id, product_id, quantity) {
    const sql = `UPDATE carrito_productos SET cantidad = ? WHERE id_carrito = ? AND id_producto = ?`;
    return pool.execute(sql, [quantity, cart_id, product_id]);
  },

  async removeProductFromCart(cart_id, product_id) {
    const sql = `DELETE FROM carrito_productos WHERE id_carrito = ? AND id_producto = ?`;
    return pool.execute(sql, [cart_id, product_id]);
  },

  async createCart(user_id, estado, fecha_creacion) {
    const sql = `INSERT INTO carrito (usuario_id, fecha_creacion, estado, total) VALUES (?, ?, ?, 0)`;
    const [result] = await pool.execute(sql, [user_id, fecha_creacion, estado]);
    return result; // Devuelve el resultado de la inserción
  },

  async findByUser(usuario_id) {
    if (!usuario_id) {
      throw new Error("El ID del usuario no puede ser undefined o null");
    }
    const [rows] = await pool.execute(
      "SELECT * FROM carrito WHERE usuario_id = ?",
      [usuario_id]
    );
    if (rows.length === 0) return null; // Si no se encuentra el carrito, devuelve null
    return rows[0]; // Retorna el carrito encontrado
  },
};

module.exports = Cart;
