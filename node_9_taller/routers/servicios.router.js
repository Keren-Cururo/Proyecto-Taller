const express = require("express");
const router = express.Router();
const multer = require("multer"); // multer
const path = require("path"); // es la ruta interna de los archivos en la pc
const controller = require("../controllers/servicios.controller");
const authMiddleware = require("../middleware/auth.middleware");


// Configuración del almacenamiento para multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Esta carpeta debe existir en la raíz del proyecto
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Genera un nombre único para la imagen
    },
});

// Configuración de multer con validación de tipo de archivo
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpg|jpeg|png/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Tipo de archivo no soportado");
    },
    limits: { fileSize: 2000 * 2000 * 2 }, // Aproximadamente 1 MB
});

//// RUTAS ////
// Ruta protegida con autenticación
router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).send(`Bienvenido al sistema ${req.userId}`); // Respuesta tras autenticación exitosa
});
// Ruta para registrar servicios con subida de imagen
// Todos los servicios
router.get('/', controller.allServicio);

// Un servicio específico
router.get('/:id_servicio', controller.showServicio);

// Crear servicio con imagen
router.post('/', upload.single('imagen'), controller.storeServicio);

// Actualizar servicio (imagen opcional)
router.put('/:id_servicio', upload.single('imagen'), controller.updateServicio);

// Eliminar servicio
router.delete('/:id_servicio', controller.destroyServicio);

module.exports = router;
