/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/generos.controller");
const verificarToken = require("../middleware/auth.middleware");



//// METODO GET  /////

// Para todos los Genero
router.get('/', controller.allGeneros);

// Para un producto
router.get('/:id_genero', controller.showGenero);

//POST//
router.post('/', controller.storeGenero);

//// METODO PUT  ////
router.put('/:id_genero', controller.updateGenero);

//// METODO DELETE ////
router.delete('/:id_genero', controller.destroyGenero);

// EXPORTAR ROUTERS
module.exports = router;