const subcaracteristicaService = require('../services/subCaracteristicasService');

const controller ={}
 controller.createSubcaracteristica = (req, res) => {
    // Verifica que req.body no sea undefined
    console.log("Cuerpo de la solicitud:", req.body); // Agrega este log para depuración

    const { nombre_subcaracteristica, id_caracteristica, imagen } = req.body;

    // Verifica que los valores no sean undefined o null
    if (!nombre_subcaracteristica || !id_caracteristica) {
        return res.status(400).json({ message: "nombre_subcaracteristica e id_caracteristica son requeridos" });
    }

      if (!nombre_subcaracteristica || !id_caracteristica) {
        return res.status(400).json({ message: "nombre_subcaracteristica e id_caracteristica son requeridos" });
    }

    const nuevaSubcaracteristica = {
        nombre_subcaracteristica,
        id_caracteristica,
        imagen
    };

    subcaracteristicaService.crearSubCategorias(nuevaSubcaracteristica)
        .then(result => {
            res.status(201).json({
                message: 'Subcaracterística creada exitosamente',
                subCaracteristica: result,
            });
        })
        .catch(error => {
            console.error("Error al crear la subcaracterística:", error);
            res.status(500).json({
                message: 'Error al crear la subcaracterística',
                error: error.message,
            });
        });
};

controller.getAllSubcaracteristicas= async(req,res)=>{
      try {
        const subcaracteristica = await subcaracteristicaService.listarsubCaracteristicas(); // Asegúrate de usar `await`
        if (!subcaracteristica || subcaracteristica.length === 0) {
          return res.status(404).json({ message: "No se encontraron datos" });
        }
        res.status(200).json({
          message: "Datos encontrados",
          data: subcaracteristica,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "No se pudo listar las características",
          error: error.message,
        });
      }
}

module.exports = controller;