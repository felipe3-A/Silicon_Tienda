const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");

router.post("/create", cartController.createCart); // eSTO Me permitira crear un carrito Crear carrito
router.get("/list/:usuario_id", cartController.getCart); // listar un carrito de un usuario - esto podria usarlo si creo el servico
router.post("/add", cartController.addProductToCart); // Agregar producto al carrito
router.post("/remove", cartController.removeProductFromCart); // Eliminar producto del carrito
// Ruta para listar productos del carrito
router.get("/cart/:cartId/products", cartController.listProducts);


//Contenido card

module.exports = router;