const Caracteristica = require("../services/caracteristicaService");

const controller = {};

// Función para obtener todas las características
controller.getAllCaracteristicas = async (req, res) => {
  try {
    const caracteristicas = await Caracteristica.getAllCaracteristicas(); // Asegúrate de usar `await`
    if (!caracteristicas || caracteristicas.length === 0) {
      return res.status(404).json({ message: "No se encontraron datos" });
    }
    res.status(200).json({
      message: "Datos encontrados",
      data: caracteristicas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "No se pudo listar las características",
      error: error.message,
    });
  }
};

// Función para crear una nueva característica
controller.createCaracteristica = async (req, res) => {
  try {
    const { nombre_caracteristica, id_categoria } = req.body;

    if (!nombre_caracteristica || !id_categoria) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const nuevaCaracteristica = { nombre_caracteristica, id_categoria };
    const result = await Caracteristica.createCaracteristica(nuevaCaracteristica);

    res.status(201).json({
      message: "Característica creada exitosamente",
      data: { id: result.insertId, ...nuevaCaracteristica },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al crear la característica",
      error: error.message,
    });
  }
};

// Función para obtener características por categoría
controller.getCaracteristicasByCategoria = async (req, res) => {
  try {
    const { id_categoria } = req.params;
    const caracteristicas = await Caracteristica.getByCategoria(id_categoria);

    if (!caracteristicas.length) {
      return res.status(404).json({ message: "No se encontraron características para esta categoría" });
    }

    res.status(200).json({
      message: "Características encontradas",
      data: caracteristicas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener características por categoría",
      error: error.message,
    });
  }
};

module.exports = controller;
