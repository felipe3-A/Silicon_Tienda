const {
  Usuario,
  findOneByEmail,
  deleteById,
  findById
} = require("../models/UsuarioModel");

const { findByPk } = require('../models/UsuarioModel');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UsuarioModel= require("../models/UsuarioModel")

const {listaNegraService} = require('./listaNegraService');


require("dotenv").config(); // Es importante agregar los paréntesis para que se ejecute correctamente

async function crearUsuario(UsuarioData) {
  try {
    if (
      !UsuarioData.nombre ||
      !UsuarioData.email ||
      !UsuarioData.identificacion ||
      !UsuarioData.direccion ||
      !UsuarioData.telefono ||
      !UsuarioData.password  ||
      !UsuarioData.telefono2 ||
      !UsuarioData.rol ||
      !UsuarioData.idperfil
    ) {
      throw new Error("Faltan datos del usuario");
    }

    const defaultPassword = UsuarioData.identificacion;
    if (!defaultPassword) {
      throw new Error("Identificacion no Proporcionada");
    }

   
    

    if (!UsuarioData.password || UsuarioData.password.trim() === "") {
      throw new Error("El campo contraseña es obligatorio.");
    }

    const hashedPassword = await bcrypt.hash(UsuarioData.password, 12);
    UsuarioData.password = hashedPassword;

    const nuevoUsuario = await Usuario.create(UsuarioData);
    return nuevoUsuario;
  } catch (error) {
    throw error;
  }
}

function crearToken(user) {
  const { id, nombre,  email, identificacion,idperfil } = user;
  const payload = { userId: id, email , nombre, identificacion, idperfil};
  console.log("Atributos del payload:", payload); 
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '30m' };
  const token = jwt.sign(payload, secret, options);
  return token;
}


const obtenerUsuarios = async () => {
  try {
    const usuarios = await Usuario.findAll();
    return usuarios;
  } catch (error) {
    throw error;
  }
};


async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "El correo electrónico y la contraseña son requeridos" });
    }

    console.log("Email recibido:", email);

    const user = await findOneByEmail(email);

    if (!user) {
      console.log("Usuario no encontrado para el email:", email);
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("La contraseña no coincide para el usuario:", email);
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    const { password: _, ...userData } = user; // Excluye el password

    res.json({
      success: "Inicio de sesión correcto",
      token:crearToken(user),
      userId: user.id,
      user: userData,
  
    }); 
  } catch (error) {
    console.error("Error interno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}


const cerrarSesion = async (token) => {
  try {
    // Agregar el token a la lista negra
    await listaNegraService.agregarToken(token);
    return { message: 'Sesión cerrada exitosamente' };
  } catch (error) {
    throw error;
  }
}


const editarUsuario = async (id, nuevoUsuario) => {
  try {
      const result = await UsuarioModel.Usuario.update(id, nuevoUsuario); // Asegúrate de que esta línea esté correcta
      return result; // Devuelve el resultado de la operación
  } catch (error) {
      console.error("Error al editar el usuario:", error);
      throw error; // Lanza el error para que pueda ser manejado en el controlador
  }
};
async function eliminarUsuario(id) {
  try {
    await deleteById(id);
    return { message: "Usuario eliminado exitosamente" };
  } catch (error) {
    throw error;
  }
}


async function getUsuarioById(id) {
  try {
    const usuario = await findByPk(id); // Llamamos al servicio para obtener el usuario por su ID
    if (!usuario) {
      throw new Error('Usuario no encontrado');

    } 
    // Seleccionar solo los campos deseados del usuario
    const {  nombre, email, identificacion, telefono, telefono2,perfil, direccion } = user;
    return {  nombre, email, identificacion, telefono, telefono2, perfil, direccion };



  } catch (error) {
    throw new Error('Error al obtener el usuario por ID: ' + error.message);

  }
}



module.exports = {
  obtenerUsuarios,
  loginUser,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
getUsuarioById,
  cerrarSesion
};
