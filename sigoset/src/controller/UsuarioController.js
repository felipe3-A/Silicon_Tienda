const {
  Usuario,
  obtenerUsuarios,
  editarUsuario,
  eliminarUsuario,
  crearUsuario,
  cerrarSesion,
  getUsuarioById,
  loginUser, // Asegúrate de incluir esta función
} = require("../services/usuarioService");
const { UsuarioModel, findById } = require("../models/UsuarioModel");
const UsuarioService = require("../services/usuarioService")
const { findOneByEmail } = require("../models/UsuarioModel");

const controller = {};

// Crear usuario
controller.crearUsuario = async (req, res, next) => {
  try {
    const UsuarioData = req.body;

    // Asegúrate de que el rol esté definido
    const rol_user = req.body.rol || "usuario"; // Asigna un valor predeterminado si no se especifica

    console.log("Datos recibidos:", UsuarioData);

    if (!UsuarioData.email) {
      return res.status(400).json({
        status: 400,
        message: "El campo 'email' es obligatorio.",
      });
    }

    const existingUser = await findOneByEmail(UsuarioData.email);
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "El correo electrónico ya está registrado",
      });
    }

    // Asegúrate de que el modelo soporte el campo 'rol'
    UsuarioData.rol = rol_user; // Añadir rol a los datos del usuario
    const usuario = await crearUsuario(UsuarioData);

    res.status(201).json({
      message: "Usuario creado exitosamente",
      rol: rol_user, // Confirmar que el rol fue asignado correctamente
      data: usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Error al crear usuario",
      error: error.message,
    });
  }
};

// Obtener usuarios
controller.obtenerUsuarios = async (req, res, next) => {
  try {
    const usuarios = await obtenerUsuarios();
    res.status(200).json({
      message: "Usuarios listados correctamente",
      data: usuarios,
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "No se obtuvieron los usuarios",
      error: error.message,
    });
  }
};

controller.getUsuarioById = async (req, res) => {
  try {
    const id = req.params.id; // Obtener el ID del usuario de los parámetros de la solicitud
    const user = await findById(id); // Llamar al servicio para obtener el usuario por ID
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ user }); // Enviar el usuario como respuesta
  } catch (error) {
    console.error("Error al obtener el usuario por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Editar usuario
controller.editarUsuario = async (req, res) => {
  const { id } = req.params; // ID del usuario a editar
  console.log("ID del Usuario:", id); // Verifica que el ID se esté recibiendo

  const {
    nombre,
    email,
    identificacion,
    direccion,
    telefono,
    password,
    telefono2,
    rol,
    idperfil,
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID del usuario es requerido." });
  }

  const usuarioData = {};
  if (nombre) {
    usuarioData.nombre = nombre;
  }
  if (email) {
    usuarioData.email = email;
  }
  if (identificacion) {
    usuarioData.identificacion = identificacion;
  }
  if (identificacion) {
    usuarioData.direccion = direccion;
  }
  if (telefono) {
    usuarioData.telefono = telefono;
  }
  if (password) {
    usuarioData.password = password;
  }
  if (telefono2) {
    usuarioData.telefono2 = telefono2;
  }
  if (rol) {
    usuarioData.rol = rol;
  }
  if (idperfil) {
    usuarioData.idperfil = idperfil;
  }

  // Si no se envió ningún dato para actualizar
  if (Object.keys(usuarioData).length === 0) {
    return res.status(400).json({ message: "No hay datos para actualizar." });
  }

  try {
    const resultado = await UsuarioService.editarUsuario(id, usuarioData);
   
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el usuario." });
    }

    res.status(200).json({
      message: "Usuario actualizado con éxito",
      data: usuarioData,
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

// Eliminar usuario
controller.eliminarUsuario = async (req, res, next) => {
  try {
    const idUsuario = req.params.id;
    await eliminarUsuario(idUsuario);
    res.status(200).json({
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "No se encontró ningún usuario con el ID proporcionado",
      error: error.message,
    });
  }
};

//Login de usuario
controller.postLogin = async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

controller.cerrarSesionC = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({
        status: 401,
        error: "No se proporcionó un token de autenticación",
      });
    }

    const token = req.headers["authorization"]; // Obtener el token del encabezado de la solicitud

    // Llamar al servicio de cierre de sesión
    await cerrarSesion(token);

    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = controller;
