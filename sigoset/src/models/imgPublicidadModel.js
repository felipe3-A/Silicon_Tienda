const pool = require("../config/database");
const { deleteById } = require("./categoriaModel");
const { findAll, findById, update } = require("./imageModels");

const ImagenPublicidad = {
  findAll: function () {
    return pool.execute("SELECT * FROM imagenes_publicitarias");
  },
  findById: function (id_imagen_publicitaria) {
    return pool
      .execute(
        "SELECT * FROM imagenes_publicitarias WHERE id_imagen_publicitaria =?",
        [id_imagen_publicitaria]
      )
      .then(([rows]) => {
        if (rows.length === 0) return null;
        return rows[0];
      });
  },

  findByImageId: async function (id_imagen) {
    const sql = `
      SELECT ip.*, 
             p.nombre_producto, p.descripcion_producto, p.precio_producto, 
             c.categoria, 
             g.nombre_grupo 
      FROM imagenes_publicitarias ip
      LEFT JOIN imagenes p ON ip.id_imagen = p.id_imagen
      LEFT JOIN categoria c ON ip.id_categoria = c.id_categoria
      LEFT JOIN grupos g ON ip.id_grupo = g.id_grupo
      WHERE ip.id_imagen = ? OR ip.id_categoria = ? OR ip.id_grupo = ?
    `;

    const [rows] = await pool.execute(sql, [id_imagen, id_imagen, id_imagen]);
    return rows.length > 0 ? rows : null;
  },

  update: async function (id_imagen_publicitaria, imagenes_publicitariasData) {
    // Validar que id_imagen_publicitaria no sea nulo
    if (!id_imagen_publicitaria) {
        throw new Error("ID de imagen publicitaria es requerido.");
    }

    // Inicializar la consulta SQL y los valores
    let sql = "UPDATE imagenes_publicitarias SET ";
    const values = [];

    // Agregar campos dinámicamente solo si están definidos
    if (imagenes_publicitariasData.url_imagen_publicitaria !== undefined) {
        sql += "url_imagen_publicitaria = ?, ";
        values.push(imagenes_publicitariasData.url_imagen_publicitaria);
    }
    if (imagenes_publicitariasData.id_tipo_imagen !== undefined) {
        sql += "id_tipo_imagen = ?, ";
        values.push(imagenes_publicitariasData.id_tipo_imagen);
    }
    if (imagenes_publicitariasData.nombre_imagen_publicitaria !== undefined) {
        sql += "nombre_imagen_publicitaria = ?, ";
        values.push(imagenes_publicitariasData.nombre_imagen_publicitaria);
    }
    if (imagenes_publicitariasData.id_grupo !== undefined) {
        sql += "id_grupo = ?, ";
        values.push(imagenes_publicitariasData.id_grupo);
    }
    if (imagenes_publicitariasData.id_categoria !== undefined) {
        sql += "id_categoria = ?, ";
        values.push(imagenes_publicitariasData.id_categoria);
    }
    if (imagenes_publicitariasData.id_imagen !== undefined) {
        sql += "id_imagen = ?, ";
        values.push(imagenes_publicitariasData.id_imagen);
    }

    // Eliminar la última coma y espacio
    sql = sql.slice(0, -2);
    sql += " WHERE id_imagen_publicitaria = ?";
    values.push(id_imagen_publicitaria);

    // Ejecutar la consulta
    try {
        const [result] = await pool.execute(sql, values);
        return result;
    } catch (error) {
        throw new Error("Error al ejecutar la consulta de actualización: " + error.message);
    }
},

  deleteById: function (id_imagen_publicitaria) {
    return pool.execute(
      "DELETE FROM imagenes_publicitarias WHERE id_imagen_publicitaria = ?",
      [id_imagen_publicitaria]
    );
  },
};

module.exports = ImagenPublicidad;
