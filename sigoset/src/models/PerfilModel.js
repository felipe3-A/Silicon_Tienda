const mysql = require('mysql2');


const pool = require('../config/database');

const Perfil = {
  findAll: function() {
    return pool.execute('SELECT * FROM perfil'); // Utiliza pool.execute() para obtener una promesa
  },
  create: function(perfilData) {
    const sql = `INSERT INTO perfil ( perfil) VALUES ( ?)`;
    return pool.execute(sql, [ perfilData.perfil]);
  }
};
async function findOnePerfil(perfil) {
  const [rows, fields] = await pool.execute('SELECT * FROM perfil WHERE perfil = ?', [perfil]);
  return rows[0];
}


async function findByPerfil (idperfil) {
    const [rows, fields] = await pool.execute(`SELECT * FROM perfil WHERE idperfil = ?` , [idperfil]);
    return rows[0];    throw error;
  }

async function deleteByIdPerfil(idperfil) {
    try {
      const [result] = await pool.execute('DELETE FROM perfil WHERE idperfil = ?', [idperfil]);
      if (result.affectedRows === 0) {
        throw new Error('El perfil no existe');
      }
      return { message: 'perfil eliminado exitosamente' };
    } catch (error) {
      throw error;
    }
  }
  


module.exports = {Perfil     ,
    findByPerfil,
    findOnePerfil,
    deleteByIdPerfil,
  };
