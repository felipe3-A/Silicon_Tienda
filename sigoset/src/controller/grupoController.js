const Grupo = require("../services/grupoService");
const GrupoModel = require("../models/grupoModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Categoria = require("../models/categoriaModel");

// Crear carpeta si no existe
const imagePath = path.join(__dirname, "../../images_grupos");
if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath, { recursive: true });
}

// Configuración de almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: imagePath,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });
const controller = {};

controller.uploadImage = upload.single("icono_grupo");


controller.crearGrupo = async (req, res) => {
    try {
        const { nombre_grupo, id_categorias } = req.body; // Asegúrate de que id_categorias esté en el cuerpo de la solicitud
        const icono_grupo = req.file
            ? `http://localhost:3000/uploads_grupo/${req.file.filename}`
            : null;

        if (!req.file) {
            return res.status(400).json({ message: "La imagen es requerida." });
        }
        console.log("Cuerpo de la solicitud:", req.body);

        if (!nombre_grupo || !id_categorias) {
            return res.status(400).json({ message: "El campo de nombre y las categorías son obligatorios." });
        }

        // Verifica que id_categorias sea un array
        if (!Array.isArray(id_categorias)) {
            return res.status(400).json({ message: "id_categorias debe ser un array" });
        }

        // Convertir id_categorias a números
        const categoriasNumeros = id_categorias.map(id => parseInt(id, 10));

        // Verifica que id_categorias no sea undefined
        console.log("ID Categorías:", id_categorias); // Agrega esta línea para depuración
        console.log("CategoriasNumeros:", categoriasNumeros); // Agrega esta línea para depuración

        const categoriasValidas = await Promise.all(categoriasNumeros.map(id_categoria => Categoria.findById(id_categoria)));
        if (categoriasValidas.includes(undefined)) {
            return res.status(400).json({ message: "Una o más categorías no son válidas." });
        }

        const nuevoGrupo = { nombre_grupo, icono_grupo };
        const result = await GrupoModel.createGrupo(nuevoGrupo); // Crear el grupo sin id_categoria
        await GrupoModel.addCategoriasToGrupo(result.insertId, categoriasNumeros); // Asociar categorías después

        res.status(201).json({
            message: "Grupo creado exitosamente",
            data: { id: result.insertId, ...nuevoGrupo },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el Grupo", error: error.message });
    }
};

controller.listraGrupos = async (req, res) => {
    try {
        const Grupos = await Grupo.listarGrupos();

        if (!Grupos || Grupos.length === 0) {
            return res.status(404).json({ message: "No se encontraron Grupos." });
        }

        res.status(200).json({
            message: "Grupos listados correctamente",
            data: Grupos,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al listar los Grupos",
            error: error.message,
        });
    }
};

controller.eliminarGrupo = async (req, res) => {
    const idGrupo = req.params.id;
    try {
        await Grupo.eliminarGrupo(idGrupo);
        res.status(200).json({
            message: "Grupo eliminado correctamente",
        });
    } catch (error) {
        res.status(500).json({
            message: "No se pudo eliminar el Grupo",
            error: error.message,
        });
    }
};


controller.editarGrupo = async (req, res, next) => {
  const { id_grupo } = req.params; // Asegúrate de que estás extrayendo el ID correctamente
  console.log("ID del grupo:", id_grupo); // Verifica que el ID se esté recibiendo

  const {
      nombre_grupo,
  } = req.body;

  // Asegúrate de que el id_grupo sea válido
  if (!id_grupo) {
      return res.status(400).json({ message: "ID de grupo es requerido." });
  }

  const grupoData = {};

  // Si se subió un nuevo archivo de imagen
  if (req.file) {
      grupoData.icono_grupo = `http://localhost:3000/uploads_grupo/${req.file.filename}`;
  }

  if (nombre_grupo) {
      grupoData.nombre_grupo = nombre_grupo;
  }


  // Si no se envió ningún dato para actualizar
  if (Object.keys(grupoData).length === 0) {
      return res.status(400).json({ message: "No hay datos para actualizar." });
  }

  try {
      const resultado = await Grupo.editargrupo(id_grupo, grupoData);

      if (resultado.affectedRows === 0) {
          return res.status(404).json({ message: "No se encontró el grupo." });
      }

      res.status(200).json({
          message: "Grupo actualizada con éxito",
          data: grupoData,
      });

  } catch (error) {
      console.error("Error al actualizar el grupo:", error);
      res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};
module.exports = controller;