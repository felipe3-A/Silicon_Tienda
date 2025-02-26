const pool = require("../config/database");

const Reporte = {
  async findById(id) {
    const sql = "SELECT * FROM reportes WHERE id = ?";
    const [rows] = await pool.execute(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  

  async findAll() {
    const sql = "SELECT * FROM reportes";
    const [rows] = await pool.execute(sql);
    return rows;
  },

  async findByUserId(usuario_id) {
    const sql = "SELECT * FROM reportes WHERE usuario_id = ?";
    const [rows] = await pool.execute(sql, [usuario_id]);
    return rows;
  },

  async crearReporte(datos) {
    // Verificar si algún valor es undefined y convertirlo a null
    for (const key in datos) {
        if (datos[key] === undefined) {
            console.error(`⚠️ Error: El campo "${key}" es undefined`);
            datos[key] = null; // Convertir a null
        }
    }

    const sql = `INSERT INTO reportes (usuario_id, evidencia, estado, total, fecha_pago, metodo_pago, fecha_reporte) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    try {
        const [result] = await pool.execute(sql, [
            datos.usuario_id,
            datos.evidencia,
            datos.estado,
            datos.total,
            datos.fecha_pago,
            datos.metodo_pago,
            datos.fecha_reporte
        ]);
        return result;
    } catch (error) {
        console.error("Error en la consulta SQL:", error);
        throw error;
    }
},

  async update(id, reporteData) {
    let sql = "UPDATE reportes SET ";
    const values = [];

    if (reporteData.evidencia !== undefined) {
      sql += "evidencia = ?, ";
      values.push(reporteData.evidencia);
    }
    if (reporteData.estado !== undefined) {
      sql += "estado = ?, ";
      values.push(reporteData.estado);
    }
    if (reporteData.total !== undefined) {
      sql += "total = ?, ";
      values.push(reporteData.total);
    }
    if (reporteData.fecha_pago !== undefined) {
      sql += "fecha_pago = ?, ";
      values.push(reporteData.fecha_pago);
    }
    if (reporteData.metodo_pago !== undefined) {
      sql += "metodo_pago = ?, ";
      values.push(reporteData.metodo_pago);
    }

    sql = sql.slice(0, -2); // Eliminar la última coma
    sql += " WHERE id = ?";
    values.push(id);

    try {
      const [result] = await pool.execute(sql, values);
      return result;
    } catch (error) {
      console.error("Error al actualizar el reporte:", error);
      throw new Error("No se pudo actualizar el reporte.");
    }
  },

  async deleteById(id) {
    const sql = "DELETE FROM reportes WHERE id = ?";
    const [result] = await pool.execute(sql, [id]);
    return result;
  },
};

module.exports = Reporte;
