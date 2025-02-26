const db = require("../config/database");
const Tipo = require("../models/tipoModel");

const crearTipo = async (TipoData) => {
  try {
    const [result] = await Tipo.createP(TipoData); // Crear el producto
    return result; // Retorna el resultado de la creación
  } catch (error) {
    throw new Error('Error al guardar el producto: ' + error.message);
  }
};

const listarTipoId = async (id_tipo_imagen) => {
  try {
    const [result] = await pool.query('SELECT * FROM tipo WHERE id_tipo_imagen = ?', [id_tipo_imagen]);
    if (result.length === 0) {
      throw new Error('No se encontró ningún tipo con el ID proporcionado.');
    }
    return result[0];
  } catch (error) {
    throw error;
  }
};

const listarTipos = async () => {
  try {
    const [tipo] = await Tipo.findAllP();
    return tipo;
  } catch (error) {
    throw error;
  }
};

const editarTipo = async (id_tipo_imagen, TipoData) => {
  try {
    const [result] = await Tipo.updateByIdP(id_tipo_imagen, TipoData);
    return result;
  } catch (error) {
    throw error;
  }
};

const eliminarTipo = async (id_tipo_imagen) => {
  try {
    const [result] = await Tipo.deleteByIdP(id_tipo_imagen);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  crearTipo,
  listarTipos,
  editarTipo, // Nueva función para editar
  eliminarTipo,
  listarTipoId,
};
