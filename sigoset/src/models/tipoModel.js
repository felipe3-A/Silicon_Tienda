const pool = require("../config/database");

const Tipo = {
  findAllP: function () {
    return pool.execute("SELECT * FROM tipo_imagen");
  },

  findById: function (id_tipo_imagen) {
    return pool
      .execute("SELECT * FROM tipo_imagen WHERE id_tipo_imagen = ?", [
        id_tipo_imagen,
      ])
      .then(([rows]) => {
        if (rows.length === 0) return null;
        return rows[0];
      });
  },

  createP: function (TipoData) {
    const sql = "INSERT INTO tipo_imagen (tipo_imagen) VALUES (?)";
    return pool.execute(sql, [TipoData.tipo_imagen]);
  },

  // Nueva función para actualizar un tipo
  updateByIdP: function (id_tipo_imagen, TipoData) {
    const sql = "UPDATE tipo_imagen SET tipo_imagen = ? WHERE id_tipo_imagen = ?";
    return pool.execute(sql, [TipoData.tipo_imagen, id_tipo_imagen]);
  },

  deleteByIdP: function (id_tipo_imagen) {
    return pool.execute("DELETE FROM tipo_imagen WHERE id_tipo_imagen = ?", [
      id_tipo_imagen,
    ]);
  },
};

module.exports = Tipo;
