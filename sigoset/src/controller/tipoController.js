const Tipos = require("../services/tipoService");

const controller = {};

controller.crearTipo = async (req, res) => {
  try {
    const { tipo_imagen } = req.body;

    if (!tipo_imagen) {
      return res.status(400).json({ message: "El tipo es requerida." });
    }

    const nuevoTipo = { tipo_imagen };
    const result = await Tipos.crearTipo(nuevoTipo);

    res.status(201).json({
      message: "Tipo creado exitosamente",
      data: { id: result.insertId, ...nuevoTipo },
    });
  } catch (error) {
    console.error(error); // Añade esto para capturar el error
    res
      .status(500)
      .json({ message: "Error al crear el tipo", error: error.message });
  }
};

controller.listarTipos = async (req, res) => {
  try {
    const tipos = await Tipos.listarTipos();

    if (!tipos || tipos.length === 0) {
      return res.status(404).json({ message: "No se encontraron tipos." });
    }

    res.status(200).json({
      message: "tipos listadas correctamente",
      data: tipos,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al listar las tipos",
      error: error.message,
    });
  }
};

controller.eliminarTipo = async (req, res) => {
  const idTipo = req.params.id;

  try {
    await Tipos.eliminarTipo(idTipo);

    res.status(200).json({
      message: "Tipo eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el Tipo",
      error: error.message,
    });
  }
};

// Nueva función para editar el tipo
controller.editarTipo = async (req, res) => {
  const idTipo = req.params.id;
const nuevoTipo = req.body


  try {
    const tipoActualizado = await Tipos.editarTipo(idTipo, nuevoTipo);
    res.status(200).json({
      message: "Tipo actualizado correctamente",
      data: tipoActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar el tipo:", error.message);
    res.status(500).json({
      message: "Error al actualizar el tipo",
      error: error.message,
    });
  }
};

module.exports = controller;
