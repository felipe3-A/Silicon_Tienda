const Caracteristica = require('../models/caracteristicaModel');
const db = require ("../config/database")

const getAllCaracteristicas = async() => {
    try {
        const caracteristicas = Caracteristica.getAll();
        return caracteristicas
    } catch (error) {
        throw error;
    }
};

const getCaracteristicaById = async() => {
    Caracteristica.getById(id, callback);
};

const createCaracteristica = async (caracteristica) => {
 const query ="INSERT INTO caracteristica (nombre_caracteristica,id_categoria) VALUES (?,?)"
 const values =[
    caracteristica.nombre_caracteristica || null,
    caracteristica.id_categoria || null
];

  const [result] = await db.execute(query, values);
    return result;

};
// Nueva función para obtener características por categoría


module.exports = {
    getAllCaracteristicas,
    getCaracteristicaById,
    createCaracteristica,
    getAllCaracteristicas
};