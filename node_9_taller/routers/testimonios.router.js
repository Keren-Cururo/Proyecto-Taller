/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/testimonios.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allTestimonios);

// Para un producto
router.get('/:id_testimonio', controller.showTestimonio);

//// METODO POST  ////
router.post('/', controller.storeTestimonio);

//// METODO PUT  ////
router.put('/:id_testimonio', controller.updateTestimono);

//// METODO DELETE ////
router.delete('/:id_testimonio', controller.destroyTestimonio);

// EXPORTAR ROUTERS
module.exports = router;

