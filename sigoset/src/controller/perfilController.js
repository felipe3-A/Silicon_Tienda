const { ResponseStructure } = require('../helpers/ResponseStructure ');
const validarCamposRequeridos = require('../middleware/camposrequeridosUser');
const {crearPerfil,
    obtenerPerfiles,
    editarPerfil,
    eliminarPerfil } = require('../services/perfilService');
const {findOnePerfil} = require('../models/PerfilModel')


const controller = {}

controller.crearPerfilC = async (req, res, next) => {
  try {
    validarCamposRequeridos(['perfil'])(req, res, async () => {
      const perfilData = req.body;

      const perfilExistente= await findOnePerfil(perfilData.perfil);
      if(perfilExistente){
      return res.status(400).json({ ...ResponseStructure, status: 400, message: 'El perfil  ya está registrado' });
      }
      const perfil = await crearPerfil(perfilData);
      res.status(201).json({ ...ResponseStructure, message: 'Perfil creado exitosamente', data: perfil });
    });
  } catch (error) {
    next(error);
  }
};

controller.obtenerPerfilesC = async (req, res, next) => {
  try {
    const listPerfiles = await obtenerPerfiles();
    res.status(200).json({ ...ResponseStructure, data: listPerfiles });
  } catch (error) {
    res.status(404).json({ ...ResponseStructure, status: 404, error: 'No se obtuvieron los perfiles' });
  }
};

controller.editarPerfilC = async (req, res, next) => {
  try {
    const idperfil = req.params.idperfil;
    const nuevoPerfilData = req.body;

    // Verificar si el cuerpo de la solicitud está vacío
    if (Object.keys(nuevoPerfilData).length === 0) {
      return res.status(400).json({ ...ResponseStructure, status: 400, error: 'El cuerpo de la solicitud está vacío' });
    }

    // Verificar si todos los campos recibidos están en el cuerpo de la solicitud
    const perfilActualizado = await editarPerfil(idperfil, nuevoPerfilData);
    res.status(200).json({ ...ResponseStructure, message: 'perfil actualizado exitosamente', data: perfilActualizado });
  } catch (error) {
    res.status(404).json({ ...ResponseStructure, status: 404, error: 'No se actualizó ningún perfil con el ID proporcionado' });
  }
};


controller.eliminarPerfilC = async (req, res, next) => {
  try {
    const idperfil = req.params.idperfil;
    await eliminarPerfil(idperfil);
    res.status(200).json({ ...ResponseStructure, message: 'perfil eliminado exitosamente' });
  } catch (error) {
    res.status(404).json({ ...ResponseStructure, status: 404, error: `No se encontró ningún perfil con el ID ${req.params.idperfil} proporcionado` });
  }
};

module.exports = controller;
