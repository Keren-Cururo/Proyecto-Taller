const db = require("../db/db");

//// METODO GET  /////

// Para todos los generos
const allContactos = (req, res) => {
    const sql = "SELECT * FROM contactos";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// // Para un genero
const showContacto = (req, res) => {
    const {id_contacto} = req.params;
    const sql = "SELECT * FROM contactos WHERE id_contacto = ?";
    db.query(sql,[id_contacto], (error, rows) => {
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


//// METODO POST - crear genero ////
const storeContacto = (req, res) => {
    const {nombre_contacto, email, telefono, mensaje, fecha_envio} = req.body;
    const sql = "INSERT INTO contactos (nombre_contacto, email, telefono, mensaje, fecha_envio ) VALUES (?, ?, ?, ?, ?)";
    db.query(sql,[nombre_contacto, email, telefono, mensaje, fecha_envio ], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const contacto = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(contacto); // muestra creado con exito el elemento
    });     

};


//// METODO PUT  ////
const updateContacto = (req, res) => {
    const {id_contacto} = req.params;
    const {nombre_contacto, email, telefono, mensaje, fecha_envio} = req.body;
    const sql = "UPDATE contactos SET nombre_contacto = ?, email = ?, telefono = ?, mensaje = ?, fecha_envio = ? WHERE id_contacto = ?";
    
    db.query(sql, [nombre_contacto, email, telefono, mensaje, fecha_envio, id_contacto], (error, result) => {
        console.log(result);
        if (error) {
            console.error("Error updating contacto:", error);
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "ERROR: El servicio a modificar no existe" });
        }
        
        const contacto = { ...req.body, ...req.params }; // reconstruir el objeto del body

        res.json(contacto); // mostrar el elemento que existe
    });     
};




//// METODO DELETE ////
const destroyContacto= (req, res) => {
    const {id_contacto} = req.params;
    const sql = "DELETE FROM contactos WHERE id_contacto = ?";
    db.query(sql,[id_contacto], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El servicio a borrar no existe"});
        };
        res.json({mesaje : "Contacto eliminado"});
    }); 
};



// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allContactos,
    showContacto,
    storeContacto,
    updateContacto,
    destroyContacto
    
};
 