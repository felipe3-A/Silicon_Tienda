const ModuloXPerfil = require('../models/modeloxperfilModel');
const pool = require('../config/database');



async function crearModuloXperfil(moduloxperfilData) {
    try {
      if (!moduloxperfilData || !moduloxperfilData.idmodulo || !moduloxperfilData.idperfil || moduloxperfilData.permiso == null) {
        throw new Error('Faltan datos del módulo');
      }
  
      const nuevoModuloXperfil = await ModuloXPerfil.create(moduloxperfilData);
      return nuevoModuloXperfil;
    } catch (error) {
      throw error;
    }
  }
  
   

      
 const obtenerModulosXperfil = async () => {
    try {
      const modulosXperfil = await ModuloXPerfil.findAll();
      return modulosXperfil;
    } catch (error) {
      throw error;
    }
  };
  
  
 
 
  
 
  
  const editarModuloXperfil = async (idmodulo, idperfil, moduloxperfilData) => {
    try {
        const updatedModuloXperfil = await ModuloXPerfil.update(idmodulo, idperfil, moduloxperfilData);
        return updatedModuloXperfil;
    } catch (error) {
        throw error;
    }
};
  
const obtenerModulosPorPerfilList = async (idperfil) => {
  try {
    const sql = `
      SELECT m.*, p.*, mxp.*
      FROM moduloxperfil mxp
      JOIN modulo m ON mxp.idmodulo = m.idmodulo
      JOIN perfil p ON mxp.idperfil = p.idperfil
      WHERE mxp.idperfil = ?
    `;
    const [rows, fields] = await pool.execute(sql, [idperfil]);
    return rows;
  } catch (error) {
    throw error;
  }
};
  
  module.exports = {
 crearModuloXperfil,
 obtenerModulosXperfil,
 editarModuloXperfil,
 obtenerModulosPorPerfilList
  };
  
 
