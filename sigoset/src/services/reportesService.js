// services/reporteService.js
const db = require("../config/database");
const Reporte = require("../models/reportesModel");

const crearReporte = async (reporteData) => {
  const query = `
    INSERT INTO reportes (usuario_id, evidencia, estado, total, fecha_pago, metodo_pago,fecha_reporte)
    VALUES (?, ?, ?, ?, ?, ?,?)
  `;

  const values = [
    reporteData.usuario_id || null,
    reporteData.evidencia|| null,
    reporteData.estado || null,
    reporteData.total|| null,
    reporteData.fecha_pago|| null ,
    reporteData.metodo_pago || "Bold",
    reporteData.fecha_reporte|| null,
  ];

  const [result] = await db.execute(query, values);
  return { id: result.insertId, ...reporteData };
};

const listarReportes = async () => {
  try {
    const reportes = await Reporte.findAll();
    return reportes;
  } catch (error) {
    console.error("Error al listar reportes:", error);
    throw error;
  }
};

const obtenerReportePorId = async (id) => {
  try {
    const reporte = await Reporte.findById(id);
    if (!reporte) throw new Error("Reporte no encontrado");
    return reporte;
  } catch (error) {
    console.error("Error al obtener reporte:", error);
    throw error;
  }
};


const obtenerReporteUsuarioPorId = async (usuarioId) => {
  try {
      const query = `
          SELECT 
              u.id AS usuario_id, 
              u.nombre AS nombre_usuario, 
              u.email, 
              r.id_reportes AS reporte_id,
              r.evidencia, 
              r.total AS total_reporte,
              r.fecha_pago, 
              r.metodo_pago, 
              r.fecha_reporte,
              r.estado,
              c.id AS carrito_id, 
              pc.id_imagen, 
              img.url_imagen,
              img.nombre_producto, 
              img.descripcion_producto,
              pc.cantidad, 
              pc.precio,
              img.precio_producto, 
              img.cantidad_producto, 
              img.referencia_producto, 
              img.garantia_producto, 
              img.envio_producto
          FROM usuarios u
          LEFT JOIN reportes r ON u.id = r.usuario_id
          LEFT JOIN carrito c ON u.id = c.usuario_id
          LEFT JOIN productos_carrito pc ON c.id = pc.carrito_id
          LEFT JOIN imagenes img ON pc.id_imagen = img.id_imagen
          WHERE u.id = ?
          ORDER BY r.id_reportes DESC, c.id, pc.id
      `;

      const [result] = await db.query(query, [usuarioId]);

      if (result.length === 0) {
          return { mensaje: "No se encontraron datos para este usuario." };
      }

      // Extraer datos generales del usuario y reporte
      const usuarioData = {
          usuario_id: result[0].usuario_id,
          nombre_usuario: result[0].nombre_usuario,
          email: result[0].email,
          reporte_id: result[0].reporte_id,
          evidencia: result[0].evidencia,
          total_reporte: Math.round(parseFloat(result[0].total_reporte) || 0), // Convertir total a entero
          fecha_pago: result[0].fecha_pago,
          metodo_pago: result[0].metodo_pago,
          fecha_reporte: result[0].fecha_reporte,
          estado: result[0].estado
      };

      // Convertir precio_producto a entero y calcular el total
      let total = 0;
      const productos = result
          .filter(item => item.id_imagen !== null) // Evitar productos nulos
          .map(item => {
              const precioEntero = Math.round(parseFloat(item.precio_producto) || 0);
              total += precioEntero;

              return {
                  id_imagen: item.id_imagen,
                  url_imagen: item.url_imagen,
                  nombre_producto: item.nombre_producto,
                  descripcion_producto: item.descripcion_producto,
                  cantidad: item.cantidad,
                  precio: item.precio,
                  precio_producto: precioEntero,
                  cantidad_producto: item.cantidad_producto,
                  referencia_producto: item.referencia_producto,
                  garantia_producto: item.garantia_producto,
                  envio_producto: item.envio_producto
              };
          });

      return {
          ...usuarioData, // Datos del usuario y reporte
          total: total, // Suma total de los productos
          productos: productos // Lista de productos
      };
  } catch (error) {
      console.error('Error obteniendo el reporte del usuario:', error);
      throw error;
  }
};




const obtenerReportesPorUsuario = async (usuario_id) => {
  try {
    const reportes = await Reporte.findByUserId(usuario_id);
    return reportes;
  } catch (error) {
    console.error("Error al obtener reportes del usuario:", error);
    throw error;
  }
};

const actualizarReporte = async (id, reporteData) => {
  try {
    const result = await Reporte.update(id, reporteData);
    return result;
  } catch (error) {
    console.error("Error al actualizar el reporte:", error);
    throw error;
  }
};

const eliminarReporte = async (id) => {
  try {
    const result = await Reporte.deleteById(id);
    return result;
  } catch (error) {
    console.error("Error al eliminar el reporte:", error);
    throw error;
  }
};

module.exports = {
  crearReporte,
  listarReportes,
  obtenerReportePorId,
  obtenerReportesPorUsuario,
  actualizarReporte,
  eliminarReporte,
  obtenerReportePorId,
  obtenerReporteUsuarioPorId
};
