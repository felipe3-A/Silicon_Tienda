const express = require ('express')
const router = express.Router();
const MarcaController = require ('../controller/marcaController')


router.post('/upload_marca', MarcaController.uploadImage, MarcaController.crearMarca);
router.get('/upload_marca', MarcaController.listarMarcas)
router.delete('/upload_marca/:id', MarcaController.eliminarMarca)
router.get("/upload_marca/:id", MarcaController.listarMarcaPorId);  // Nueva ruta para obtener marca por ID

module.exports = router;