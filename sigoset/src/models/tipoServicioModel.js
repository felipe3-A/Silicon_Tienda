const pool = require("../config/database");

const Servicio = {
  createService: async (ServicioData) => {
    try {
      const sql = `
        INSERT INTO tipo_servicio (tipo_servicio)
        VALUES (?)
      `;
      await pool.execute(sql, [ServicioData.tipo_servicio]);
      return { message: "Usuario creado exitosamente" };

    } catch (error) {
      console.error("Error en create:", error);
      throw error;
    }
  },

  findByIdService: async function(id_tipo_servicio) {
    try {
      const [rows] = await pool.execute('SELECT * FROM tipo_servicio WHERE id_tipo_servicio = ?', [id_tipo_servicio]);
      return rows;
    } catch (error) {
      console.error("Error al obtener el tipo de servicio por ID:", error);
      throw error;
    }
  }
};

module.exports= Servicio