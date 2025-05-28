//controladores del modulo
const db = require("../db/db");

//metodos get para todos los roles
const allTrabajos_realizados = (req,res) => { // falta el req
    const sql = "SELECT * FROM trabajos_realizados";
    db.query(sql,(error,rows) => {
        if(error){ // si hay un error que retorne cual es el error
            return res.status(500).json({error : "Error: intente mas tarde"});
        }
        res.json(rows);// si no hay error que devuelva las filas
    });
};


// // Para un servicio
const showTrabajo_realizado = (req, res) => {
    const {id_trabajo_realizado} = req.params;
    const sql = "SELECT * FROM trabajos_realizados WHERE id_trabajo_realizado = ?";
    db.query(sql,[id_trabajo_realizado], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el trabajo realizado buscado"});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};


//// METODO POST  ////
const storeTrabajo_realizado = (req, res) => {
    console.log(req.file);
    let imageName = "";

    if(req.file){
        imageName = req.file.filename;
    };

    const {nombre_trabajo_realizado, descripcion_trabajo_realizado} = req.body;

    const sql = "INSERT INTO trabajos_realizados (nombre_trabajo_realizado , descripcion_trabajo_realizado, imagen) VALUES (?,?,?)";
    db.query(sql,[nombre_trabajo_realizado, descripcion_trabajo_realizado, imageName], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"}); //error de sintaxis, fijarse mal arriba 
        }
        const servicio = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(servicio); // muestra creado con exito el elemento
    });     

}


//// METODO PUT  ////
const updateTrabajo_realizado = (req, res) => {
    const {id_trabajo_realizado} = req.params;
    const {nombre_trabajo_realizado, descripcion_trabajo_realizado} = req.body;
    const sql ="UPDATE trabajos_realizados SET nombre_trabajo_realizado = ?, descripcion_trabajo_realizado = ? WHERE id_trabajo_realizado = ?";
    db.query(sql,[nombre_trabajo_realizado, descripcion_trabajo_realizado, id_trabajo_realizado], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El trabajo realizado a modificar no existe"});
        };
        
        const trabajo = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(trabajo); // mostrar el elemento que existe
    });     
};


//// METODO DELETE ////
const destroyTrabajo_realizado = (req, res) => {
    const {id_trabajo_realizado} = req.params;
    const sql = "DELETE FROM trabajos_realizados WHERE id_trabajo_realizado = ?";
    db.query(sql,[id_trabajo_realizado], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El trabajo realizado a borrar no existe"});
        };
        res.json({mesaje : "Trabajo realizado eliminado"});
    }); 
};

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allTrabajos_realizados,
    showTrabajo_realizado,
    storeTrabajo_realizado,
    updateTrabajo_realizado,
    destroyTrabajo_realizado
};


