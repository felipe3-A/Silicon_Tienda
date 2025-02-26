const pool = require("../config/database");

const TipoArticulo = {
  createArticuloTipo: async (ServicioData) => {
    try {
      const sql = `
        INSERT INTO tipo_articulo (tipo_articulo)
        VALUES (?)
      `;
      await pool.execute(sql, [ServicioData.tipo_articulo]);
      return { message: "Tipo de articulo creado exitosamente" };

    } catch (error) {
      console.error("Error en create:", error);
      throw error;
    }
  },

  findByIdTipoArticulo: async function(id_tipo_articulo) {
    try {
      const [rows] = await pool.execute('SELECT * FROM tipo_articulo WHERE id_tipo_articulo = ?', [id_tipo_articulo]);
      return rows;
    } catch (error) {
      console.error("Error al obtener el Tipo de Artículo Por Id:", error);
      throw error;
    }
  }
};

module.exports= TipoArticulo