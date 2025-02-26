const { ResponseStructure } = require('../helpers/ResponseStructure ');
const { crearModulo, obtenerModulos, editarModulo, eliminarModuloS } = require('../services/moduloService');
const validarCamposRequeridos = require('../middleware/camposrequeridosUser');
const {modulo} = require('../models/moduloModel')

const controller = {};

controller.crearModuloC = async (req, res, next) => {
  validarCamposRequeridos(['id_modulo_padre', 'modulo', 'url_modulo', 'icono', 'orden', 'hijos'])(req, res, async () => {
    try {
      const moduloData = req.body;
      
      const [moduloExistente] = await modulo.findByModuloAndUrl(moduloData.modulo, moduloData.url_modulo);
      if (moduloExistente.length > 0) {
        return res.status(400).json({ ...ResponseStructure, status: 400, message: 'El modulo  y URL ya está registrado' });
      }
      const nuevoModulo = await crearModulo(moduloData);
      res.status(201).json({ ...ResponseStructure, message: 'Modulo creado exitosamente', data: nuevoModulo });
    } catch (error) {
      next(error);
    }
  });
};

controller.obtenerModulosC = async (req, res, next) => {
  try {
    const listModulos = await obtenerModulos();
    res.status(200).json({ ...ResponseStructure, data: listModulos });
  } catch (error) {
    res.status(404).json({ ...ResponseStructure, status: 404, error: 'No se obtuvieron los modulos' });
  }
};

controller.editarModuloC = async (req, res, next) => {
  try {
    const idmodulo = req.params.idmodulo;
    const nuevoModuloData = req.body;

    if (Object.keys(nuevoModuloData).length === 0) {
      return res.status(400).json({ ...ResponseStructure, status: 400, error: 'El cuerpo de la solicitud está vacío' });
    }

    const camposValidos = ['id_modulo_padre', 'modulo', 'url_modulo', 'icono', 'orden', 'hijos'];
    const camposRecibidos = Object.keys(nuevoModuloData);
    const camposInvalidos = camposRecibidos.filter(field => !camposValidos.includes(field));

    if (camposInvalidos.length > 0) {
      return res.status(400).json({ ...ResponseStructure, status: 400, error: 'El cuerpo de la solicitud contiene campos no válidos', invalidFields: camposInvalidos });
    }

    const moduloActualizado = await editarModulo(idmodulo, nuevoModuloData);
    res.status(200).json({ ...ResponseStructure, message: 'Modulo actualizado exitosamente', data: moduloActualizado });
  } catch (error) {
    res.status(404).json({ ...ResponseStructure, status: 404, error: 'No se actualizó ningún modulo con el ID proporcionado' });
  }
};

controller.eliminarModuloC = async (req, res, next) => {
  try {
    const idmodulo = req.params.idmodulo;
    await eliminarModuloS(idmodulo);
    res.status(200).json({ ...ResponseStructure, message: 'Modulo eliminado exitosamente' });
  } catch (error) {
    res.status(404).json({ ...ResponseStructure, status: 404, error: `No se encontró ningún modulo con el ID ${req.params.idmodulo} proporcionado` });
  }
};

module.exports = controller;
