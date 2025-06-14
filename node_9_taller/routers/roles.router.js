/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/roles.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allRoles);

// Para un producto
router.get('/:id_rol', controller.showRol);

//// METODO POST  ////
router.post('/', controller.storeRol);

//// METODO PUT  ////
router.put('/:id_rol', controller.updateRol);

//// METODO DELETE ////
router.delete('/:id_rol', controller.destroyRol);

// EXPORTAR ROUTERS
module.exports = router;

