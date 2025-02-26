const db = require("../config/database");

const Grupo = {
  // Crear un nuevo grupo
  createGrupo: async (grupoData) => {
    const sql = `INSERT INTO grupos (nombre_grupo, icono_grupo) VALUES (?, ?)`;
    const [result] = await db.execute(sql, [grupoData.nombre_grupo, grupoData.icono_grupo]);
    return result;
  },

  // Agregar categorías a un grupo
  addCategoriasToGrupo: async (idGrupo, id_categorias) => {
    const sql = `INSERT INTO grupo_categorias (id_grupo, id_categoria) VALUES ?`;
    const values = id_categorias.map(idCategoria => [idGrupo, idCategoria]);
    const [result] = await db.query(sql, [values]);
    return result;
  },

  // Obtener todos los grupos
  AllGrupos: async () => {
    const sql = `SELECT * FROM grupos`;
    return db.execute(sql);
  },

  // Obtener un grupo por ID
  getGrupoById: async (id_grupo) => {
    const sql = `SELECT * FROM grupos WHERE id_grupo = ?`;
    const [result] = await db.execute(sql, [id_grupo]);
    return result[0];
  },

  // Editar un grupo
  update: async (id_grupo, nuevoGrupo) => {
    const sql = `UPDATE grupos SET nombre_grupo = ?, icono_grupo = ? WHERE id_grupo = ?`;
    const [result] = await db.execute(sql, [
      nuevoGrupo.nombre_grupo,
      nuevoGrupo.icono_grupo,
      id_grupo,
    ]);
    return result;
  },

  // Eliminar un grupo
  deleteGrupo: async (id_grupo) => {
    const sql = `DELETE FROM grupos WHERE id_grupo = ?`;
    const [result] = await db.execute(sql, [id_grupo]);
    return result;
  }
};

module.exports = Grupo;
