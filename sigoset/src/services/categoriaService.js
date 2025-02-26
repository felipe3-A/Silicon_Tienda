const db = require("../config/database");
const Categorias = require("../models/categoriaModel");

const crearCategoria = async (categoria) => {
 const query = "INSERT INTO  categoria (categoria, logo_categoria) VALUES (?,?)";
    const values =[
        categoria.categoria || null,
        categoria.logo_categoria || null
    ];

    const [result] = await db.execute(query, values);
    return result;
};

const listarCategorias = async () => {
  try {
    const [categorias] = await Categorias.findAll();
    return categorias;
  } catch (error) {
    throw error;
  }
};

const editarCategoria = async (id_categoria, nuevaCategoria) => {
  try {
    const [result] = await Categorias.update(id_categoria, nuevaCategoria); // Actualizar producto
    return result;
  } catch (error) {
    throw error;
  }
};

const eliminarCategoria = async (id_categoria) => {
  try {
    const [result] = await Categorias.deleteById(id_categoria); // Eliminar producto por ID
    return result;
  } catch (error) {
    throw error;
  }
};

const listarrProductoCategoria = async (id_categoria) => {
  try {
    const [productos] = await Categorias.findProductsByBrand(id_categoria);
    return productos;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  crearCategoria,
  listarCategorias,
  editarCategoria,
  eliminarCategoria,
  listarrProductoCategoria,
};
