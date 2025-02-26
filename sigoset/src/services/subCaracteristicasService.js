const Subcaracteristica = require('../models/subCaracteristica'); // Asegúrate de que el nombre sea correcto

const crearSubCategorias = async (subCaracteristicaData) => {
    try {
        const [result] = await Subcaracteristica.create(subCaracteristicaData); // Usa Subcaracteristica aquí
        return result;  // Retorna el resultado de la creación
    } catch (error) {
        throw new Error('Error al guardar la subCaracteristica: ' + error.message);
    }
}
const listarsubCaracteristicas = async() => {
    try {
        const subcaracteristicas = Subcaracteristica.getAll();
        return subcaracteristicas
    } catch (error) {
        throw error;
    }
};


module.exports = {
    crearSubCategorias,listarsubCaracteristicas

};