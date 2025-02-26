const mysql = require('mysql2');


const pool = require('../config/database');

const modulo = {
  findAll: function() {
    return pool.execute('SELECT * FROM modulo'); // Utiliza pool.execute() para obtener una promesa
  },
  create: function(moduloData) {
    const sql = `INSERT INTO modulo (id_modulo_padre, modulo, url_modulo, icono, orden, hijos) VALUES (?, ?, ?, ?, ?, ?)`;
    return pool.execute(sql, [
      moduloData.id_modulo_padre,
      moduloData.modulo,
      moduloData.url_modulo,
      moduloData.icono,
      moduloData.orden,
      moduloData.hijos
    ]);
  },
  findByModuloAndUrl: function(modulo, url_modulo) {
    return pool.execute('SELECT * FROM modulo WHERE modulo = ? AND url_modulo = ?', [modulo, url_modulo]);
  }
};


async function findByModulo (idmodulo) {
    const [rows, fields] = await pool.execute(`SELECT * FROM modulo WHERE idmodulo = ?` , [idmodulo]);
    return rows[0];    throw error;
  }

async function eliminarModulo(idmodulo) {
    try {
      const [result] = await pool.execute('DELETE FROM modulo WHERE idmodulo = ?', [idmodulo]);
      if (result.affectedRows === 0) {
        throw new Error('El modulo no existe');
      }
      return { message: 'modulo eliminado exitosamente' };
    } catch (error) {
      throw error;
    }
  }
  


module.exports ={
    modulo,
    findByModulo,
    eliminarModulo
};
