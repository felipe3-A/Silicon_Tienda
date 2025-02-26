const express = require("express");
const morgan = require('morgan');
const cors = require("cors");
const path = require('path');



const appSigoSet = express();
const port = 3000;  // O el puerto que desees
appSigoSet.use(cors());


appSigoSet.use(express.json());
appSigoSet.use(morgan("dev"));
appSigoSet.use(express.urlencoded({ extended: true }));



const productosRoutes = require("../routes/productoRoutes"); // Asegúrate de que exista y sea correcto
const usuariosRoutes = require("../routes/usuarioRoutes")
const imageRoutes = require("../routes/imageRoutes")
const marcasRouetes = require("../routes/marcaRoutes")
const categoriasRoutes = require("../routes/categoriaRoutes")
const tipoRoutes = require("../routes/TipoRoutes")
const imagePubRoutes = require("../routes/imgPublicidadRouter")
const carritoRoutes = require("../routes/cartRoutes")
const grupoRoutes = require('../routes/grupoRoutes')
const cartProductsToutes = require('../routes/cartProductsRoutes')
const ModuloRoutesm = require("../routes/moduloRoutes")
const ModuloxPerfil = require('../routes/moduloxperfilRoutes')
const solicitudRoutes = require("../routes/solicitudRoutes")
const perfilRoutes = require("../routes/perfilRoutes")

const caracteristicaRouter = require("../routes/caracteristicaRoutes")
const subCaracteristICArOUTES =  require("../routes/subCaracteristica")
const valoresCaracteristica = require("../routes/valoresCaracteristicasRoutes")


const reporteRoutes = require("../routes/reportesRoutes")
appSigoSet.use(caracteristicaRouter)
appSigoSet.use(subCaracteristICArOUTES)
appSigoSet.use(valoresCaracteristica)
appSigoSet.use(productosRoutes)
appSigoSet.use(usuariosRoutes)
appSigoSet.use(marcasRouetes)
appSigoSet.use(categoriasRoutes)
appSigoSet.use(reporteRoutes)
appSigoSet.use(tipoRoutes);
appSigoSet.use(imagePubRoutes);
appSigoSet.use(cartProductsToutes)
appSigoSet.use(grupoRoutes)
appSigoSet.use(carritoRoutes)
appSigoSet.use(ModuloRoutesm)
appSigoSet.use(ModuloxPerfil)
appSigoSet.use(solicitudRoutes)
appSigoSet.use(perfilRoutes)


appSigoSet.use('/api/imagenes', imageRoutes);
appSigoSet.use("/uploads", express.static(path.join(__dirname, "../../images")));

appSigoSet.use('/api/reportes', reporteRoutes);
appSigoSet.use("/uploads_reportes", express.static(path.join(__dirname, "../../reportes")));


appSigoSet.use('/api/grupos', grupoRoutes);
appSigoSet.use("/uploads_grupo", express.static(path.join(__dirname, "../../images_grupos")));

appSigoSet.use('/api/solicitud', solicitudRoutes);
appSigoSet.use("/uploads_solicitud", express.static(path.join(__dirname, "../../images_solicitud")));

appSigoSet.use('/api/imagenes_gallery', imageRoutes);
appSigoSet.use("/uploads_gallery", express.static(path.join(__dirname, "../../images_gallery")));

appSigoSet.use('/api/marca',marcasRouetes)
appSigoSet.use("/uploads_marca", express.static(path.join(__dirname, "../../images_marcas")));

appSigoSet.use('/api/publicidad',imagePubRoutes)
appSigoSet.use("/uploads_publicidad", express.static(path.join(__dirname, "../../images_publicidad")));

appSigoSet.use('/api/categoria',categoriasRoutes)
appSigoSet.use('/uploads_categoria', express.static(path.join(__dirname, '../../images_categorias')));


appSigoSet.set("port", process.env.PORT || port);

module.exports = appSigoSet;
