const db = require("../db/db");

//// METODO GET  /////

// Para todos los generos
const allAdministradores = (req, res) => {
    const sql = "SELECT * FROM administradores";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// // Para un genero
const showAdministrador = (req, res) => {
    const {id_administrador} = req.params;
    const sql = "SELECT * FROM administradores WHERE id_administrador = ?";
    db.query(sql,[id_administrador], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el servicio buscado"});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};


//// METODO POST - crear un administrador////
const storeAdministrador = (req, res) => {
    const {id_usuario} = req.body;

    if (!id_usuario) {
        return res.status(400).json({error: "id_usuario es requerido"});
    }

    const sql = "INSERT INTO administradores (id_usuario) VALUES (?)";
    db.query(sql, [id_usuario], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({error: "ERROR: Intente más tarde por favor"});
        }
        const administrador = {id_usuario: id_usuario, id: result.insertId};
        res.status(201).json(administrador);
    });
};



//// METODO PUT  ////
const updateAdministrador = (req, res) => {
    const {id_administrador} = req.params;
    const {id_usuario} = req.body;
    const sql = "UPDATE administradores SET id_usuario = ? WHERE id_administrador = ?";
    
    db.query(sql, [id_usuario, id_administrador], (error, result) => {
        console.log(result);
        if (error) {
            console.error("Error updating administrador:", error);
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "ERROR: El administrador a modificar no existe" });
        }
        
        const administrador= { ...req.body, ...req.params }; // reconstruir el objeto del body

        res.json(administrador); // mostrar el elemento que existe
    });     
};




//// METODO DELETE ////
const destroyAdministrador= (req, res) => {
    const {id_administrador} = req.params;
    const sql = "DELETE FROM administradores WHERE id_administrador = ?";
    db.query(sql,[id_administrador], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El administrador a borrar no existe"});
        };
        res.json({mesaje : "administrador eliminado"});
    }); 
};



// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allAdministradores,
    showAdministrador,
    storeAdministrador,
    updateAdministrador,
    destroyAdministrador
    
};
 