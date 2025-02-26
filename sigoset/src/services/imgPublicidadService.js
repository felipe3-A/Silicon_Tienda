const db = require("../config/database")
const ImgPublicidad = require("../models/imgPublicidadModel")

const crearImagenPublicidad = async (imgpublicidad) => {
  const query = `
  INSERT INTO imagenes_publicitarias (
      url_imagen_publicitaria, 
      id_tipo_imagen, 
      nombre_imagen_publicitaria,
      id_grupo,
      id_categoria,
      id_imagen
  ) VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [
      imgpublicidad.url_imagen_publicitaria || null,
      imgpublicidad.id_tipo_imagen || null,
      imgpublicidad.nombre_imagen_publicitaria || null,
      imgpublicidad.id_grupo || null,
      imgpublicidad.id_categoria || null,
      imgpublicidad.id_imagen || null
  ];

  const [result] = await db.execute(query, values);
  return result;
};


const obtenerImagenPublicidadPorId = async (id_imagen) => {
  try {
    const imagenData = await ImgPublicidad.findByImageId(id_imagen);
    return imagenData;
  } catch (error) {
    throw error;
  }
};


const listarImagenesPublicitarias = async () => {
    try {
      const [imagenes] = await ImgPublicidad.findAll();
      return imagenes;
    } catch (error) {
      throw error;
    }
  };

  const eliminarProductoPublicidad = async (id_imagen_publicitaria) => {
    try {
      const [result] = await ImgPublicidad.deleteById(id_imagen_publicitaria); // Eliminar producto por ID
      return result;
    } catch (error) {
      throw error;
    }
  };

  const listImagesPubByType = function (idTipo) {
    const sql = `SELECT * FROM imagenes_publicitarias WHERE id_tipo_imagen= ?`;
    return db.execute(sql, [idTipo]);
  };

  const actualizarImagenPublicidad = async (id_imagen_publicitaria, imagenes_publicitariasData) => {
    try {
      const result = await ImgPublicidad.update(id_imagen_publicitaria, imagenes_publicitariasData);
      return result;
    } catch (error) {
      throw error;
    }
  };
  

  module.exports={
    crearImagenPublicidad,listarImagenesPublicitarias,eliminarProductoPublicidad, listImagesPubByType,obtenerImagenPublicidadPorId,actualizarImagenPublicidad
  }