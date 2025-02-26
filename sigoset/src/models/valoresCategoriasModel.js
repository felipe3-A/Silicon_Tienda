const db = require("../config/database");

const ValoresCaracteristica = {
  getAllWithDetails: async function() {
    const sql = `
      SELECT 
          s.id_subcaracteristica,
          s.nombre_subcaracteristica,
          s.imagen_subcaracteristica,
          c.id_caracteristica,
          c.nombre_caracteristica,
          v.valor
      FROM 
          subcaracteristica AS s
      LEFT JOIN 
          caracteristica AS c ON s.id_caracteristica = c.id_caracteristica
      LEFT JOIN 
          valores_caracteristicas AS v ON s.id_subcaracteristica = v.id_subcaracteristica;
    `;
    const [results] = await db.execute(sql);
    return results;
  },

  getByProducto: (id_imagen, callback) => {
    db.query(
      "SELECT v.id_valor, s.nombre_subcaracteristica, v.valor FROM valores_caracteristicas v JOIN subcaracteristica s ON v.id_subcaracteristica = s.id_subcaracteristica WHERE v.id_imagen = ?",
      [id_imagen],
      callback
    );
  },

    create: async function(valoresData) {
      const sql = "INSERT INTO valores_caracteristicas (id_imagen, id_subcaracteristica, valor, url_imagen_caracteristica) VALUES (?, ?, ?, ?)";
      const [result] = await db.execute(sql, [
        valoresData.id_imagen || null, // Asegúrate de que no sea undefined
        valoresData.id_subcaracteristica || null, // Asegúrate de que no sea undefined
        valoresData.valor || null, // Asegúrate de que no sea undefined
        valoresData.url_imagen_caracteristica || null // Asegúrate de que no sea undefined
      ]);
      return result;
    }
};

module.exports = ValoresCaracteristica;