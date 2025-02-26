const pool = require("../config/database");

const Marca = {
  findAll: function () {
    return pool.execute("SELECT * FROM marca");
  },

  findById: function (id_marca) {
    return pool
      .execute("SELECT * FROM marca WHERE id_marca = ?", [id_marca])
      .then(([rows]) => {
        if (rows.length === 0) return null;
        return rows[0];
      });
  },

  create: function (MarcaData) {
    const sql = "INSERT INTO marca (marca,logo_marca) VALUES (?,?)";
    return pool.execute(sql, [MarcaData.marca, MarcaData.logo_marca]);
  },

  update: function (id_marca, MarcaData) {
    const sql = "UPDATE marca SET marca=?, logo_marca=? WHERE id_marca= ?";
    return pool.execute(sql, [MarcaData.marca, MarcaData.logo_marca]);
  },

  deleteById: function (id_marca) {
    return pool.execute("DELETE FROM marca WHERE id_marca = ?", [id_marca]);
  },

  // Nueva función para listar productos de una marca
  findProductsByBrand: function (id_marca) {
    const sql = `
        SELECT 
            m.id_marca, m.marca, m.logo_marca, 
            i.id_imagen, i.nombre_producto, i.precio_producto, i.descripcion_producto
        FROM 
            marca m
        JOIN 
            imagenes i ON m.id_marca = i.id_marca
        WHERE 
            m.id_marca = ?`;
    return pool.execute(sql, [id_marca]);
  },
};

module.exports = Marca;
