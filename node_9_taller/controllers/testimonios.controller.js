//controladores del modulo
const db = require("../db/db");

//metodos get para todos los roles
const allTestimonios = (req,res) => { // falta el req
    const sql = "SELECT * FROM testimonios";
    db.query(sql,(error,rows) => {
        if(error){ // si hay un error que retorne cual es el error
            return res.status(500).json({error : "Error: intente mas tarde"});
        }
        res.json(rows);// si no hay error que devuelva las filas
    });
};


// // Para un servicio
const showTestimonio = (req, res) => {
    const {id_testimonio} = req.params;
    const sql = "SELECT * FROM testimonios WHERE id_testimonio = ?";
    db.query(sql,[id_testimonio], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el buscado buscado"});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST - crear rol ////
const storeTestimonio = (req, res) => {
    const {nombre_cliente, comentario, fecha_envio } = req.body;
    const sql = "INSERT INTO testimonios (nombre_cliente, comentario, fecha_envio) VALUES (?,?,?)";
    db.query(sql,[nombre_cliente, comentario, fecha_envio], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const testimonio = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(testimonio); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateTestimono = (req, res) => {
    const { id_testimonio } = req.params;
    const { nombre_cliente, comentario, fecha_envio } = req.body;
    const sql = "UPDATE testimonios SET nombre_cliente = ?, comentario = ?, fecha_envio = ? WHERE id_testimonio = ?";
    db.query(sql, [nombre_cliente, comentario, fecha_envio, id_testimonio], (error, result) => {
        console.log(result);
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" });
        }
        if (result.affectedRows == 0) {
            return res.status(404).send({ error: "ERROR: El servicio a modificar no existe" });
        }
        
        const testimonio = { ...req.body, ...req.params }; // ... reconstruir el objeto del body

        res.json(testimonio); // mostrar el elemento que existe
    });
};


//// METODO DELETE ////
const destroyTestimonio = (req, res) => {
    const {id_testimonio} = req.params;
    const sql = "DELETE FROM testimonios WHERE id_testimonio = ?";
    db.query(sql,[id_testimonio], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El servicio a borrar no existe"});
        };
        res.json({mesaje : "Testimonio eliminado"});
    }); 
};

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allTestimonios,
    showTestimonio,
    storeTestimonio,
    updateTestimono,
    destroyTestimonio
};
