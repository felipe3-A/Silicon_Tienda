const db = require("../config/database");
const Grupo = require("../models/grupoModel");

const crearGrupo = async (grupoData, id_categorias) => {
    const result = await Grupo.createGrupo(grupoData);
    await Grupo.addCategoriasToGrupo(result.insertId, id_categorias);
    return result;
};

const listarGrupos = async () => {
    try {
        const [grupos] = await Grupo.AllGrupos();
        return grupos;
    } catch (error) {
        throw error;
    }
};


const editargrupo = async (id_gripo, nuevoGrupo) => {
    try {
      const result = await Grupo.update(id_gripo, nuevoGrupo); // Eliminar producto por ID
      return result;
    } catch (error) {
        console.error("Error al editar el producto:", error);
      throw error;
    }
  };

const obtenerGrupoId = function (idGrupo) {
    const sql = `SELECT * FROM grupos WHERE id_grupo = ?`;
    return db.execute(sql, [idGrupo]);
  }

const eliminarGrupo = async (id_grupo) => {
    try {
        const [result] = await Grupo.deleteGrupo(id_grupo);
        return result;
    } catch (error) {
        throw error;
    }
};





module.exports = {
    crearGrupo,
    obtenerGrupoId,
    listarGrupos,
    eliminarGrupo,
    editargrupo
};