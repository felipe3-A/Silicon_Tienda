const { modulo,
    findByModulo,
    eliminarModulo} = require('../models/moduloModel');
   const pool = require('../config/database');
  
  
   async function crearModulo(moduloData) {
    try {
      if (!moduloData.id_modulo_padre || !moduloData.modulo || !moduloData.url_modulo || !moduloData.icono || !moduloData.orden || !moduloData.hijos) {
        throw new Error('Faltan datos del modulo');
      }
  
      const [nuevoModulo] = await modulo.create(moduloData);
      return nuevoModulo;
    } catch (error) {
      throw error;
    }
  }
   
   const obtenerModulos = async () => {
     try {
       const modulos = await modulo.findAll();
       return modulos;
     } catch (error) {
       throw error;
     }
   };
   
   
  
  
   
   async function editarModulo(idmodulo, nuevoModuloData) {
     try {
       const moduloExistente = await findByModulo(idmodulo);
       if (!moduloExistente) {
         throw new Error('El modulo no existe');
       }
   
       const muoduloActualizado = { ...moduloExistente, ...nuevoModuloData };
   
       // Realizar la actualización en la base de datos
       const [result] = await pool.execute(
         'UPDATE modulo SET  id_modulo_padre = ?, modulo = ? , url_modulo = ? , icono = ?, orden = ?, hijos = ? WHERE idmodulo = ?',
         [
          muoduloActualizado.id_modulo_padre,
          muoduloActualizado.modulo,
          muoduloActualizado.url_modulo ,
          muoduloActualizado.icono ,
          muoduloActualizado.orden ,
          muoduloActualizado.hijos ,
           idmodulo
         ]
       );
   
       // Verificar si la actualización fue exitosa
       if (result.affectedRows === 0) {
         throw new Error('No se pudo actualizar el modulo');
       }
   
       return muoduloActualizado;
     } catch (error) {
       throw error;
     }
   }
   
   async function eliminarModuloS(idmodulo) {
     try {
       await eliminarModulo(idmodulo);
       return { message: 'modulo eliminado exitosamente' };
     } catch (error) {
       throw error;
     }
   }
   
  
   
  
   
   
   
   
   module.exports = {
     crearModulo,
     obtenerModulos,
     editarModulo,
     eliminarModuloS
   };
   
  