
const db = require ("../config/database")
const Marcas = require("../models/marcaModel");
const { editarProducto, eliminarProducto } = require("./imagenService");

const crearMarca = async (marca)=>{
    const query = "INSERT INTO  marca (marca, logo_marca) VALUES (?,?)";
    const values =[
        marca.marca || null,
        marca.logo_marca || null
    ];

    const [result] = await db.execute(query, values);
    return result;
};

const listarMarcas = async() =>{
    try {
        const [marcas] = await Marcas.findAll();
        return marcas;
    } catch (error) {
        throw error;
    }
}

const listarProductoMarca = async (id_marca) => {
    try {
        const [productos] = await Marcas.findProductsByBrand(id_marca);
        return productos;
    } catch (error) {
        throw error;
    }
};

const eliminarMarca = async (id_marca)=>{
    try {
        const [result]= await Marcas.deleteById(id_marca);
        return result;
    } catch (error) {
         throw error;
    }
}

const obtenermaracId = async (id_marca)=>{
    try {
        const [result]= await Marcas.findById(id_marca);
        return result;
    } catch (error) {
         throw error;
    }
}


module.exports={
    crearMarca, 
    editarProducto,
     eliminarProducto,
     obtenermaracId,
     listarMarcas,
      listarProductoMarca,
      eliminarMarca
}