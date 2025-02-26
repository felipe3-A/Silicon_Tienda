const pool = require("../config/database");

const Categoria = {
  findAll: function () {
    return pool.execute("SELECT * FROM categoria");
  },

  findById: function (id_categoria) {
    return pool
      .execute("SELECT * FROM categoria WHERE id_categoria = ?", [id_categoria])
      .then(([rows]) => {
        if (rows.length === 0) return null;
        return rows[0];
      });
  },

  create: function (CategoriaData) {
    const sql = "INSERT INTO categoria (categoria,logo_categoria) VALUES (?,?)";
    return pool.execute(sql, [CategoriaData.categoria, CategoriaData.logo_categoria]);
  },
  

  update: function (id_categoria, CategoriaData) {
    const sql = "UPDATE categoria SET categoria = ? WHERE id_categoria = ?";
    return pool.execute(sql, [CategoriaData.categoria, id_categoria]); // Aquí pasamos ambos parámetros
  },
  


  deleteById: function (id_categoria) {
    return pool.execute("DELETE FROM categoria WHERE id_categoria = ?", [
      id_categoria,
    ]);
  },

  findProductsByBrand: function (id_categoria) {
    const sql = `
    SELECT
        m.id_categoria, m.categoria,
         i.id_imagen, i.nombre_producto, i.precio_producto, i.descripcion_producto, url_imagen
    
    FROM 
        categoria m
    JOIN
        imagenes i ON m.id_categoria = i.id_categoria
    WHERE
        m.id_categoria = ?  `;

        return pool.execute(sql,[id_categoria])
  },
};

module.exports = Categoria;
