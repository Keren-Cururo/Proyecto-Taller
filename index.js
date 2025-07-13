// CONFIGURAR LO QUE SERIA UN SERVIDOR CON LAS MINIMAS PRESTACIONES PARA CORRER EXPRESS
// Que este escuchando y tengamos una ruta principal "/" en el proyecto
// require("dotenv").config();
const express = require("express");
require("dotenv").config();
const app = express();
const cors = require('cors');
app.use(cors()); // Permitir todos los orígenes
app.use(express.json());


const path = require('path');

// en el cuerpo de la peticion viene un json, lo voy a transformar en un objeto JS y de esta manera
// lo voy a poder utilizar
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// En app.js o server.js
app.use('/uploads', express.static('uploads'));


const serviciosRouter = require('./node_9_taller/routers/servicios.router');
app.use('/servicios', serviciosRouter);
// Siempre que me refiera a servicios le coloco el prefijo

// aca esta register y login 
const usuariosRouter = require('./node_9_taller/routers/usuarios.router');
app.use('/usuarios', usuariosRouter);

const generosRouter = require('./node_9_taller/routers/generos.router');
app.use('/generos', generosRouter);


const localidadesRouter = require('./node_9_taller/routers/localidades.router');
app.use('/localidades', localidadesRouter);

const empleadosRouter = require('./node_9_taller/routers/empleados.router');
app.use('/empleados', empleadosRouter);

const rolesRouter = require('./node_9_taller/routers/roles.router');
app.use('/roles', rolesRouter);

const contactosRouter = require('./node_9_taller/routers/contactos.router');
app.use('/contactos', contactosRouter);

const testimoniosRouter = require('./node_9_taller/routers/testimonios.router');
app.use('/testimonios', testimoniosRouter);

const administradoresRouter = require('./node_9_taller/routers/administradores.router');
app.use('/administradores', administradoresRouter);

const trabajos_realizadosRouter = require('./node_9_taller/routers/trabajos_realizados.router');
app.use('/trabajos_realizados', trabajos_realizadosRouter);


// Ruta principal: devolver index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;// que coloque en el puerto lo que este definido en el servidor o por default 3000. env=enviroment

app.listen(PORT, ()=> console.log(`http://localhost:${PORT}`));