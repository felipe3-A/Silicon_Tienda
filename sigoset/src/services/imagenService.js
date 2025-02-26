// services/imagenService.js
const db = require("../config/database"); // Asegúrate de tener tu conexión a la base de datos
const Imagen = require("../models/imageModels"); // Asegúrate de importar correctamente todos los servicios



const crearImagen = async (imagenData) => {
  const query = `
    INSERT INTO imagenes (
      nombre_producto,
      precio_producto,
      descripcion_producto,
      cantidad_producto,
      referencia_producto,
      garantia_producto,
      envio_producto,
      id_categoria,
      id_marca,
      url_imagen,
      id_galeria,
      id_grupo,
      estado_producto
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    imagenData.nombre_producto || null,
    imagenData.precio_producto || null,
    imagenData.descripcion_producto || null,
    imagenData.cantidad_producto || null,
    imagenData.referencia_producto || null,
    imagenData.garantia_producto || null,
    imagenData.envio_producto || null,
    imagenData.id_categoria || null,
    imagenData.id_marca || null,
    imagenData.url_imagen || null,
    imagenData.id_galeria || null,
    imagenData.id_grupo || null, 
    imagenData.estado_producto ||null // Asegúrate de que esta propiedad tenga el nombre correcto
  ];

  const [result] = await db.execute(query, values);
  return result;
};

const listarImagenes = async () => {
  try {
    const [imagenes] = await Imagen.findAllWithGallery();
    if (!Array.isArray(imagenes)) {
      throw new Error("La respuesta no es válida.");
    }
    return imagenes.map((imagen) => ({
      ...imagen,
      galeria: imagen.galeria ? JSON.parse(imagen.galeria) : null,
    }));
  } catch (error) {
    throw error;
  }
};

const crearImagenConGaleria = async (imagenData) => {
  try {
    // Validar si la galería existe
    const [galeria] = await Imagen.findById(imagenData.id_galeria);
    if (!galeria) {
      throw new Error("La galería asociada no existe.");
    }

    // Crear el producto con la galería
    const result = await Imagen.createWithGallery(imagenData);
    return result;
  } catch (error) {
    throw error;
  }
};

const getGallery = async() => {
  try {
    const [galeria] = await Imagen.findAllGallery();
    return galeria;
  } catch (error) {
    throw error;
  }
};

// Función para crear una galería de imágenes
const crearGaleria = async (galeriaData) => {
  const query = `
  INSERT INTO galeria (
      url_imagenes,
      titulo_grupo
  ) VALUES (?, ?)
  `;
  const values = [
    galeriaData.url_imagenes || null, // JSON con las URLs
    galeriaData.titulo_grupo,
  ];
  const [result] = await db.execute(query, values);
  return result;
};



const editarProducto = async (id_imagen, nuevoProducto) => {
  try {
      const result = await Imagen.update(id_imagen, nuevoProducto); // Asegúrate de que esta línea esté correcta
      return result; // Devuelve el resultado de la operación
  } catch (error) {
      console.error("Error al editar el producto:", error);
      throw error; // Lanza el error para que pueda ser manejado en el controlador
  }
};

const eliminarProducto = async (id_imagen) => {
  try {
    const [result] = await Imagen.deleteById(id_imagen); // Eliminar producto por ID
    return result;
  } catch (error) {
    throw error;
  }
};



async function obttenerGaleriaId(id_galeria) {
  try {
    const galeriaArray = await Imagen.findById(id_galeria);
    const galeria = galeriaArray[0]; // Obtener el primer elemento del arreglo
    if (!galeria) {
      console.log("Galería no encontrada:", id_galeria);
      throw new Error("La galería asociada no existe.");
    }
    console.log("Galería encontrada:", galeria);
    return galeria;
  } catch (error) {
    console.error("Error al obtener galería:", error.message);
    throw error;
  }
}


const listImagesByCategoria = function (categoriaId) {
  const sql = `SELECT * FROM imagenes WHERE id_categoria = ?`;
  return db.execute(sql, [categoriaId]);
};

const listImagesByGroup = function (grupoId) {
  const sql = `SELECT * FROM imagenes WHERE id_grupo = ?`;
  return db.execute(sql, [grupoId]);
};


const listImagesById = function (imageId) {
  const sql = `SELECT * FROM imagenes WHERE id_imagen = ?`;
  return db.execute(sql, [imageId]);
}

const listImagesByMarca = function (marcaId) {
  const sql = `SELECT * FROM imagenes WHERE id_grupo= ?`;
  return db.execute(sql, [marcaId]);
};




module.exports = {
  crearImagen,
  getGallery,
  listImagesByCategoria,
  listarImagenes,
  crearGaleria,
  eliminarProducto,
  editarProducto,
  listImagesByMarca,
  listImagesById,
  crearImagenConGaleria,
  obttenerGaleriaId,
  listImagesByGroup
};
