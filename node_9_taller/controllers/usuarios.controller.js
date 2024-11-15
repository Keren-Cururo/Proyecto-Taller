/// CONTROLADORES DEL MODULO ///
const db = require("../db/db");
const jwt = require("jsonwebtoken");
const fs = require('fs'); // proporciona una API que interactua con archivos, puede renombrar archivos, leerlos, darles nombre, eliminarlos, etc.
const bcrypt = require("bcryptjs");

//guardar la img en ruta
function saveImage(file) {
    const newPath = `./uploads/${file.originalname}`;
    fs.renameSync(file.path, newPath);// con fs lo renombro
    return newPath; // retorna la nueva ruta
}


//METODO POST///

const registerUsuario = (req, res) => {
    console.log(req.file);
    let imageName = "";
    if (req.file) {
        imageName = req.file.filename;
    }

    // Extraer los datos del cuerpo de la solicitud
    const { nombreUsuario, apellidoUsuario, correoElectronico, telefono, fechaNacimiento, password, idGenero, idRol, idLocalidad } = req.body;

    // Encriptar la contraseña
    let hash = bcrypt.hashSync(password, 8);
    console.log(hash);

    // Verificar si el usuario ya existe
    db.query('SELECT * FROM usuarios WHERE correo_electronico = ?', [correoElectronico], (error, result) => {
        if (error) {
            console.error("Registration error:", error);
            return res.status(500).send("Error checking user existence");
        }

        if (result.length > 0) {
            return res.status(400).send("User with that email already exists.");
        }

         /////////////////////////
        const sql = "INSERT INTO usuarios (nombre_usuario, apellido_usuario, correo_electronico, telefono, fecha_nacimiento, password, imagen, id_genero, id_rol, id_localidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [nombreUsuario, apellidoUsuario, correoElectronico, telefono, fechaNacimiento, hash, imageName, idGenero, idRol, idLocalidad];
        
        db.query(sql, values, (error, result) => {
            if (error) {
                console.log("Error al intentar realizar el insert", error);
                return res.status(500).json({ error: "Error en el código, intente más tarde" });
            }

            // Definir userId
            const userId = result.insertId;

            // Generar un token JWT con el ID del usuario
            const token = jwt.sign(
                { id: userId },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            );

            // Enviar la respuesta con el token
            const userCreado = { ...req.body, id: result.insertId };
            res.status(201).json({ userCreado, token });
        });
    });
};


//realizar autenticacion e integracion 

// Función para hacer login
const loginUsuario = (req, res) => {
    const { correoElectronico, password } = req.body;

    // Buscar al usuario por correo electrónico
    db.query('SELECT * FROM usuarios WHERE correo_electronico = ?', [correoElectronico], (error, result) => {
        if (error) {
            console.error("Login error:", error);
            return res.status(500).send("Error during login");
        }

        // Verificar si el usuario existe
        if (result.length === 0) { 
            return res.status(404).send("User not found.");
        }

        const user = result[0]; // Obtener el usuario de la consulta

        // Agregar logs para verificar los valores
        console.log("Resultados de la consulta:", result);
        console.log("Contraseña ingresada:", password);
        console.log("Contraseña almacenada:", user.password);

        // Verificar que la contraseña almacenada no sea undefined
        if (!user.password) {
            console.error("Contraseña almacenada no encontrada o es undefined");
            return res.status(500).send("Contraseña almacenada no encontrada");
        }

        // Comparar la contraseña
        bcrypt.compare(password, user.password, (error, passwordIsValid) => {
            if (error) {
                console.error("Error comparing passwords:", error);
                return res.status(500).send("Error comparing passwords");
            }

            if (!passwordIsValid) { 
                return res.status(401).send({ auth: false, token: null });
            }

            // Generar un token JWT con el ID del usuario
            const token = jwt.sign({ id: user.idUsuario }, process.env.SECRET_KEY, {
                expiresIn: "1h",
            });

            // Enviar la respuesta con el token
            res.status(201).send({ user, token });
        });
    });
};






//// METODO GET  /////

// Para todos los usuarios
const allUsuario = (req, res) => {
    const sql = "SELECT * FROM usuarios";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};




// Para un usuario
const showUsuario = (req, res) => {
    const {idUsuario} = req.params;
    const sql = "SELECT * FROM usuarios WHERE id_usuario = ?";
    db.query(sql, [idUsuario], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el usuario buscado"});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};



const updateUsuario = (req, res) => {
    console.log(req.file); // Mostrar los datos de la imagen en la consola

    if (!req.file) {
        return res.status(400).send('No se subió ningún archivo');
    }

    const imageName = saveImage(req.file); // Guardar la imagen subida
    const { idUsuario } = req.params; // Obtener el ID del usuario como parámetro
    const { nombreUsuario, apellidoUsuario, correoElectronico, telefono, fechaNacimiento, password, idGenero, idRol, idLocalidad } = req.body; // Obtener los datos del cuerpo de la solicitud

    // Verificar que todos los datos estén presentes
    console.log(req.body);

    // Hashear la contraseña antes de guardarla
    if (!password) {
        return res.status(400).json({ error: "La contraseña es requerida" });
    }
    const hash = bcrypt.hashSync(password, 8); // Generar el hash de la contraseña
    console.log(hash); // Ver el hash en la consola

    // Consulta SQL para actualizar el usuario
    const sql = "UPDATE usuarios SET nombre_usuario = ?, apellido_usuario =?, correo_electronico = ?, telefono = ?, fecha_nacimiento =?, password = ?, imagen = ?, id_genero = ?, id_rol = ?, id_localidad =? WHERE id_usuario = ?";
    db.query(sql, [nombreUsuario, apellidoUsuario, correoElectronico, telefono, fechaNacimiento, hash, imageName, idGenero, idRol, idLocalidad, idUsuario], (error, result) => {
        if (error) {
            console.log("Error al intentar actualizar el usuario en la tabla Usuarios:", error);
            return res.status(500).json({ error: `Error al actualizar el usuario ${idUsuario}` });
        }

        // Obtener el usuario actualizado
        const sqlSelect = "SELECT * FROM usuarios WHERE id_usuario = ?";
        db.query(sqlSelect, [idUsuario], (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Error: intente más tarde" });
            }
            const userActualizado = result[0]; // Mostrar el id_rol en la respuesta
            res.status(200).json({ message: "El usuario se ha actualizado correctamente", user: userActualizado });
        });
    });
};






//// METODO DELETE ////
const destroyUsuario = (req, res) => {
    const {idUsuario} = req.params;
    const sql = "DELETE FROM usuarios WHERE id_usuario = ?";
    db.query(sql,[idUsuario], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El usuario a borrar no existe"});
        };
        res.json({mesaje : "Usuario Eliminado"});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    registerUsuario,
    loginUsuario,
    allUsuario,
    showUsuario,
    updateUsuario,
    destroyUsuario
};