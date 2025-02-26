const mysql = require('mysql2');
const pool = require('../config/database');
const bcrypt = require('bcrypt');

const Usuario = {
  // Crear un login con email, identificación y contraseña
  createLogin: async (email, identificacion, password) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hashea la contraseña
      await pool.execute(
        'INSERT INTO usuarios (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );
    } catch (error) {
      console.error("Error en createLogin:", error);
      throw error;
    }
  },

  // Encuentra todos los usuarios
  findAll: async () => {
    try {
      const [rows] = await pool.execute('SELECT * FROM usuarios');
      return rows;
    } catch (error) {
      console.error("Error en findAll:", error);
      throw error;
    }
  },

  // Crea un usuario
  create: async function (UsuarioData) {
    try {
      const sql = `
        INSERT INTO usuarios (nombre, email, identificacion, direccion, telefono, password, telefono2, rol, idperfil)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Ejecutar la consulta
      await pool.execute(sql, [
        UsuarioData.nombre,
        UsuarioData.email,
        UsuarioData.identificacion,
        UsuarioData.direccion,
        UsuarioData.telefono,
        UsuarioData.password, // Asegúrate de que la contraseña esté hasheada si es necesario
        UsuarioData.telefono2,
        UsuarioData.rol,
        UsuarioData.idperfil
      ]);
      return { message: 'Usuario creado exitosamente' };
    } catch (error) {
      console.error("Error en create:", error);
      throw error;
    }
  },

  findByPk: async function (id) {
    try {
      const query = `
        SELECT 
          usuarios.*,
          perfil.perfil
        FROM 
          usuarios
        JOIN 
          perfil ON usuarios.idperfil = perfil.idperfil
        WHERE 
          usuarios.id = ?
      `;
  
      const [rows] = await pool.execute(query, [id]);
      return rows[0]; // Devuelve el primer usuario encontrado
    } catch (error) {
      console.error("Error en findByPk:", error);
      throw error;
    }
  },

  update: async function (id, usuarioData) {
      // Validar que id no sea nulo
      if (!id) {
        throw new Error("ID de imagen es requerido.");
      }
  
      // Inicializar la consulta SQL y los valores
      let sql = "UPDATE usuarios SET ";
      const values = [];
  
      // Agregar campos a la consulta solo si están presentes en usuarioData
      if (usuarioData.nombre !== undefined) {
        sql += "nombre = ?, ";
        values.push(usuarioData.nombre);
      }
      if (usuarioData.email !== undefined) {
        sql += "email = ?, ";
        values.push(usuarioData.email);
      }
      if (usuarioData.identificacion !== undefined) {
        sql += "identificacion = ?, ";
        values.push(usuarioData.identificacion);
      }
      if (usuarioData.direccion !== undefined) {
        sql += "direccion = ?, ";
        values.push(usuarioData.direccion);
      }
      if (usuarioData.telefono !== undefined) {
        sql += "telefono = ?, ";
        values.push(usuarioData.telefono);
      }
      if (usuarioData.password !== undefined) {
        sql += "password = ?, ";
        values.push(usuarioData.password);
      }
      if (usuarioData.telefono2 !== undefined) {
        sql += "telefono2 = ?, ";
        values.push(usuarioData.telefono2);
      }
      if (usuarioData.rol !== undefined) {
        sql += "rol = ?, ";
        values.push(usuarioData.rol);
      }
      if (usuarioData.id_perfil !== undefined) {
        sql += "id_perfil = ?, ";
        values.push(usuarioData.id_perfil);
      }
      
      // Eliminar la última coma y espacio
      sql = sql.slice(0, -2); // Eliminar la última coma y espacio
      sql += " WHERE id = ?"; // Agregar la cláusula WHERE
      values.push(id); // Agregar el id_imagen al final de los valores
  
      try {
        const [result] = await pool.execute(sql, values);
        return result; // Devuelve el resultado de la operación
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        throw new Error("No se pudo actualizar el usuario."); // Lanza un error si algo falla
      }
    },

};

// Encuentra un usuario por ID
async function findById(id) {
  try {
    const [result] = await pool.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (result.length === 0) {
      throw new Error('El usuario no existe');
    }
    return result[0]; // Devuelve el usuario encontrado
  } catch (error) {
    console.error("Error en Obtener el usuario:", error);
    throw error;
  }
}

// Encuentra un usuario por email
async function findOneByEmail(email) {
  if (!email) {
    throw new Error("El parámetro 'email' no puede ser undefined o vacío.");
  }
  
  const sql = "SELECT * FROM usuarios WHERE email = ?";
  const [rows] = await pool.execute(sql, [email]);
  return rows[0] || null;
}

// Elimina un usuario por ID
async function deleteById(id) {
  try {
    const [result] = await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      throw new Error('El usuario no existe');
    }
    return { message: 'Usuario eliminado exitosamente' };
  } catch (error) {
    console.error("Error en deleteById:", error);
    throw error;
  }
}

module.exports = {
  Usuario,
  findById,
  findOneByEmail,
  deleteById,
};