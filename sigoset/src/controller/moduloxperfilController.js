const { crearModuloXperfil,
    obtenerModulosXperfil,
    editarModuloXperfil,
    obtenerModulosPorPerfilList} = require('../services/moduloxperfilService');


    const { ResponseStructure } = require('../helpers/ResponseStructure ');
const validarCamposRequeridos = require('../middleware/camposrequeridosUser');
const controller = {}

controller.crearModuloXperfilC = async (req, res, next) => {
  try {
    validarCamposRequeridos(['idmodulo', 'idperfil', 'permiso'])(req, res, async () => {
      const moduloxperfilData = req.body;

    
      const moduloxperfil = await crearModuloXperfil(moduloxperfilData);
      res.status(201).json({ ...ResponseStructure, message: 'mod creado exitosamente', data: moduloxperfil });
    });
  } catch (error) {
    res.status(400).json({ ...ResponseStructure, status: 400, error: error.message });
}
};

controller.obtenerModuloxperfilC = async (req, res, next) => {
  try {
    const listModulosXperfil = await obtenerModulosXperfil();
    res.status(200).json({ ...ResponseStructure, data: listModulosXperfil });
  } catch (error) {
    res.status(404).json({ ...ResponseStructure, status: 404, error: 'No se obtuvieron los mod' });
  }
};

controller.editarModuloXperfilC = async (req, res, next) => {
  try {
      validarCamposRequeridos(['permiso'])(req, res, async () => {
          const { idmodulo, idperfil } = req.params;
          const moduloxperfilData = req.body;
          const updatedModuloXperfil = await editarModuloXperfil(idmodulo, idperfil, moduloxperfilData);
          res.status(200).json({ ...ResponseStructure, message: 'mod actualizado exitosamente', data: updatedModuloXperfil });
      });
  } catch (error) {
      res.status(400).json({ ...ResponseStructure, status: 400, error: error.message });
  }
}

controller.obtenerModuloxperfilListC = async (req, res, next) => {
  try {
    const { idperfil } = req.params; // Cambiado de req.body a req.params
    const modulosPorPerfil = await obtenerModulosPorPerfilList(idperfil);
    res.status(200).json({ ...ResponseStructure, data: modulosPorPerfil });
  } catch (error) {
    res.status(404).json({ ...ResponseStructure, status: 404, error: 'No se obtuvieron los módulos por perfil' });
  }
}

module.exports = controller;
