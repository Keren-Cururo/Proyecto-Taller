

// CONTROLADORES DEL MODULO ///
const db = require("../db/db");
const jwt = require("jsonwebtoken"); // Importamos la libreria que nos ayuda a autenticar
const fs = require('fs'); // Proporciona una API que interactua con archivos, puede renombrar archivos, leerlos, darles nombre, eliminarlos, etc.
const bcrypt = require("bcryptjs"); // Importamos la libreria que nos ayuda a hacer el hash
const path = require("path");

const registerUsuario = (req, res) => {
    console.log('Archivo recibido:', req.file);  // Mostrar el archivo de imagen si hay uno
    let imageName = "";
    if (req.file) {
        imageName = req.file.filename;
    }

    // 🔥 Cambiado a snake_case para que coincida con el FormData del frontend
    const {
        nombre_usuario,
        apellido_usuario,
        correo_electronico,
        telefono,
        fecha_nacimiento,
        password,
        id_genero,
        id_rol,
        id_localidad
    } = req.body;

    // Encriptar la contraseña
    const hash = bcrypt.hashSync(password, 8);
    console.log('Hash de la contraseña:', hash);

    // Verificar si el usuario ya existe
    db.query('SELECT * FROM usuarios WHERE correo_electronico = ?', [correo_electronico], (error, result) => {
        if (error) {
            console.error("Error al verificar la existencia del usuario:", error);
            return res.status(500).send("Error verificando la existencia del usuario.");
        }

        if (result.length > 0) {
            return res.status(400).send("Ya existe un usuario con ese correo electrónico.");
        }

        const sql = `
            INSERT INTO usuarios 
            (nombre_usuario, apellido_usuario, correo_electronico, telefono, fecha_nacimiento, password, imagen, id_genero, id_rol, id_localidad)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nombre_usuario,
            apellido_usuario,
            correo_electronico,
            telefono,
            fecha_nacimiento,
            hash,
            imageName,
            id_genero,
            id_rol,
            id_localidad
        ];

        db.query(sql, values, (error, result) => {
            if (error) {
                console.log("Error al intentar registrar el usuario:", error);
                return res.status(500).json({ error: "Error en el código, intente más tarde." });
            }

            const userId = result.insertId;

            // Generar un token JWT con el ID del usuario
            const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: "1h" });
            console.log('Token generado para el nuevo usuario:', token);

            const userCreado = { ...req.body, id: userId };
            res.status(201).json({ userCreado, token });
        });
    });
};



// Método POST para hacer login
const loginUsuario = (req, res) => {
    const { correoElectronico, password } = req.body;

    console.log('Intento de login - Correo Electrónico:', correoElectronico);
    console.log('Contraseña:', password);

    // Buscar al usuario por correo electrónico
    db.query('SELECT * FROM usuarios WHERE correo_electronico = ?', [correoElectronico], (error, result) => {
        if (error) {
            console.error("Error al consultar la base de datos:", error);
            return res.status(500).send("Error durante el inicio de sesión.");
        }

        console.log("Resultados de la base de datos:", result);
        if (result.length === 0) {
            console.log('Usuario no encontrado.');
            return res.status(404).send({ error: "User not found." });
        }

        const user = result[0];
        console.log('Usuario encontrado:', user);

        // Verificar la contraseña
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            console.log('Contraseña inválida.');
            return res.status(401).send({ auth: false, token: null });
        }

        console.log('Contraseña válida.');

        // Generar un token JWT con el ID del usuario
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: "1h"
        });

        console.log('Token generado:', token);

        // Enviar la respuesta con el token
        res.status(200).json({ auth: true, token });
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
        if(rows.length === 0){
            return res.status(404).send({error : "ERROR: No existe el usuario buscado por ID"});
        };
        res.json(rows[0]);
        // me muestra el elemento en la posicion cero si existe.
    });
};


const updateUsuario = (req, res) => {
    console.log("Imagen recibida:", req.file);  // Mostrar los datos de la imagen para debug
    console.log("Body recibido:", req.body);    // Mostrar el cuerpo completo para debug

    const { idUsuario } = req.params;

    // Usamos los datos recibidos en el body (debe coincidir con el frontend)
    const {
        nombre_usuario,
        apellido_usuario,
        correo_electronico,
        telefono,
        fecha_nacimiento,
        password,
        id_genero,
        id_rol,
        id_localidad
    } = req.body;

    // Si hay una nueva imagen, tomamos el nombre del archivo; si no, usamos la imagen actual
    let imagen = req.body.imagen || '';  // Si no hay imagen en el body, usamos la actual

    // Verificamos si hay un archivo de imagen en req.file
    if (req.file) {
        imagen = req.file.filename;  // Si hay una nueva imagen, la actualizamos
    }

    // Si hay una nueva contraseña, la encriptamos
    let hash;
    if (password) {
        hash = bcrypt.hashSync(password, 8);
        console.log("Hash generado:", hash);
    }

    // Preparamos la consulta SQL para la actualización
    let sql = `
        UPDATE usuarios 
        SET nombre_usuario = ?, apellido_usuario = ?, correo_electronico = ?, telefono = ?, 
            fecha_nacimiento = ?, password = ?, imagen = ?, id_genero = ?, id_rol = ?, id_localidad = ? 
        WHERE id_usuario = ?
    `;

    // Preparamos los valores que van a la consulta SQL
    const values = [
        nombre_usuario,
        apellido_usuario,
        correo_electronico,
        telefono,
        fecha_nacimiento,
        password ? hash : undefined,  // Solo incluir el hash si se proporciona la contraseña
        imagen,
        id_genero,
        id_rol,
        id_localidad,
        idUsuario
    ];

    // Limpiamos valores undefined (si no se ha proporcionado contraseña, por ejemplo)
    const cleanedValues = values.filter(value => value !== undefined);

    // Ejecutamos la consulta para actualizar el usuario
    db.query(sql, cleanedValues, (error, result) => {
        if (error) {
            console.log("Error al intentar actualizar el usuario en la tabla Usuarios:", error);
            return res.status(500).json({ error: `Error al actualizar el usuario ${idUsuario}` });
        }

        // Seleccionamos el usuario actualizado para devolverlo al frontend
        const sqlSelect = "SELECT * FROM usuarios WHERE id_usuario = ?";
        db.query(sqlSelect, [idUsuario], (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Error: intente más tarde" });
            }

            const userActualizado = result[0];
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

