const express = require("express");
const router = express.Router();
const multer = require("multer"); // multer
const path = require("path"); // es la ruta interna de los archivos en la pc
const controller = require("../controllers/usuarios.controller");
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
    limits: { fileSize: 1024 * 1024 * 1 }, // Aproximadamente 1 MB
});



// Debug adicional para la ruta de registro
router.post('/register', upload.single('imagen'), (req, res, next) => {
    console.log("Datos enviados desde el frontend:");
    console.log("Body:", req.body);// Para depurar datos del formulario
    console.log("Archivo:", req.file);// Para depurar información del archivo
    next();
}, controller.registerUsuario);

// Definición de las rutas

// Ruta para obtener todos los usuarios
router.get('/', controller.allUsuario);

// Ruta para mostrar un usuario por ID
router.get('/:idUsuario', controller.showUsuario);

router.post('/usuarios', (req, res) => {
    // Lógica para manejar la solicitud POST
    res.status(200).send('Usuario creado correctamente');
  });
  
  
// Ruta para registrar usuarios con subida de imagen
// router.post('/register', upload.single('imageName'), controller.registerUsuario); // Ajustado aquí}}}}

// Ruta para login de usuario
router.post('/login', controller.loginUsuario);

// Ruta protegida con autenticación
router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).send(`Bienvenido al sistema ${req.userId}`); // Respuesta tras autenticación exitosa
});

// Ruta para actualizar usuarios con subida de imagen
router.put('/:idUsuario', upload.single('imagen'), controller.updateUsuario); // Ajustado aquí

// Ruta para eliminar usuarios
router.delete('/:idUsuario', controller.destroyUsuario);



// Exportar el router
module.exports = router;