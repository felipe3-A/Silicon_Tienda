const db = require("../config/database");
const Solicitud = require("../models/SolicitudModel");

const crearSolicitud = async (solicitudData) => {
  const query = `
    INSERT INTO Solicitud(
    descripcion_falla,
              fecha_compra,
              fecha_vendimiento_garantia,
              numero_factura,
              numero_garantia,
              tipo_solicitud,
              id_marca,
              id_tipo_servicio,
              id_tipo_articulo,
              id,
              id_galeria_Solicitud,
              garantia_producto
    
    )VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;

  const values = [
    solicitudData.descripcion_falla || null,
    solicitudData.fecha_compra || null,
    solicitudData.fecha_vendimiento_garantia || null,
    solicitudData.numero_factura || null,
    solicitudData.numero_garantia || null, // Asegúrate de que este campo esté presente
    solicitudData.tipo_solicitud || null,
    solicitudData.id_marca || null,
    solicitudData.id_tipo_servicio || null,
    solicitudData.id_tipo_articulo || null,
    solicitudData.id || null,
    solicitudData.id_galeria_Solicitud || null,
    solicitudData.garantia_producto || null, // Asegúrate de que este campo esté presente
  ];
  const [result] = await db.execute(query, values);
  return result;
};

const getGallerySolicitudes = async () => {
  try {
    const [galeriaSolicitudes] = await Solicitud.AllGallerySolicitudes();
    return galeriaSolicitudes;
  } catch (error) {
    throw error;
  }
};

const crearSolicitudconGaleria = async (imagenData) => {
  try {
    // Validar si la galería existe
    const [galeria_solicitud] = await Solicitud.findByIdSolicitud(
      imagenData.id_solicitud
    );
    if (!galeria_solicitud) {
      throw new Error("La galería asociada no existe.");
    }

    // Crear el producto con la galería
    const result = await Solicitud.createAOrder(imagenData);
    return result;
  } catch (error) {
    throw error;
  }
};

const listarSolicitudes = async () => {
  try {
    const [galeriaSolitud] = await Solicitud.AllSolicitudes();
    return galeriaSolitud;
  } catch (error) {
    throw error;
  }
};


const listarTipoArticulos = async () => {
  try {
    const [tipoArticulos] = await Solicitud.AllTipoArticulos();
    return tipoArticulos;
  } catch (error) {
    throw error;
  }
};


const listarTipodeServicio = async () => {
  try {
    const [tipoArticulos] = await Solicitud.AllTiposServicio();
    return tipoArticulos;
  } catch (error) {
    throw error;
  }
};


// Función para crear una galería de imágenes
const crearGaleriaSolicitud = async (galeriaDataSolicitud) => {
  const query = `
    INSERT INTO galeria_solicitud (
        url_imagenes_solicitud,
        titulo_galeria
    ) VALUES (?, ?)
    `;
  const values = [
    galeriaDataSolicitud.url_imagenes_solicitud || null, // JSON con las URLs
    galeriaDataSolicitud.titulo_galeria,
  ];
  const [result] = await db.execute(query, values);
  return result;
};

const eliminarSolicitud = async (id_solicitud) => {
  try {
    const [result] = await Solicitud.deleteSolicitudById(id_solicitud); // Eliminar producto por ID
    return result;
  } catch (error) {
    throw error;
  }
};

async function obttenerGaleriaSolicitudId(id_galeria_Solicitud) {
  try {
    const galeriaArray = await Solicitud.findByIdGaleriaSolicitud(
      id_galeria_Solicitud
    );
    const galeria = galeriaArray[0]; // Obtener el primer elemento del arreglo
    if (!galeria) {
      console.log("Galería no encontrada:", id_galeria_Solicitud);
      throw new Error("La galería asociada no existe.");
    }
    console.log("Galería encontrada:", galeria);
    return galeria;
  } catch (error) {
    console.error("Error al obtener galería:", error.message);
    throw error;
  }
}

const listSolicitudById = function (solicitudId) {
  const sql = `SELECT * FROM solicitud WHERE id_solicitud = ?`;
  return db.execute(sql, [solicitudId]);
};

module.exports = {
  crearGaleriaSolicitud,
  crearSolicitud,
  listSolicitudById,
  listarSolicitudes,
  getGallerySolicitudes,
  obttenerGaleriaSolicitudId,
  eliminarSolicitud,
  crearSolicitudconGaleria,
  listarTipoArticulos,
  listarTipodeServicio
};
