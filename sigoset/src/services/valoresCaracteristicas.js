const ValoresCaracteristica = require('../models/valoresCategoriasModel');
const db = require("../config/database"); // Asegúrate de tener tu conexión a la base de datos


const getAllValoresCaracteristicas = async () => {
    try {
      const valores = await ValoresCaracteristica.getAllWithDetails(); // Espera los resultados
      return valores; // Devuelve los resultados
    } catch (error) {
      throw error; // Lanza el error para que pueda ser manejado en el controlador
    }
  };

const getValoresByProducto = (id_imagen,) => {
    ValoresCaracteristica.getByProducto(id_imagen, callback);
};

const listSubById = function (subId) {
  const sql = `SELECT * FROM subcaracteristica WHERE id_subcaracteristica = ?`;
  return db.execute(sql, [subId]);
}

const createValorCaracteristica = async (valoresData) => {
  try {
    const result = await ValoresCaracteristica.create(valoresData);
    return result;
  } catch (error) {
    throw new Error('Error al guardar los valores: ' + error.message);
  }
};

module.exports = {
  listSubById,
    getAllValoresCaracteristicas,
    getValoresByProducto,
    createValorCaracteristica,
};