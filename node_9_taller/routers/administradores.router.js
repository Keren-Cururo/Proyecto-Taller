/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/administradores.controller")


//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allAdministradores);

// Para un producto
router.get('/:id_administrador', controller.showAdministrador);

//// METODO POST  ////
router.post('/', controller.storeAdministrador);

//// METODO PUT  ////
router.put('/:id_administrador', controller.updateAdministrador);

//// METODO DELETE ////
router.delete('/:id_administrador', controller.destroyAdministrador);

// EXPORTAR ROUTERS
module.exports = router;
