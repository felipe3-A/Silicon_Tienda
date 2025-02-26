const express = require("express");
const router = express.Router();
const productosCarritoController = require("../controller/cartProductsController");

router.post("/add", productosCarritoController.addProductToCart); // Agregar producto al carrito
router.post("/remove", productosCarritoController.removeProductFromCart); // Eliminar producto del carrito
router.get("/cartProducts/:id_carrito", productosCarritoController.getProductsInCart); // Obtener productos en el carrito

module.exports = router;