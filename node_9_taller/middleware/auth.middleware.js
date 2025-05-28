const jwt = require("jsonwebtoken");
const db = require("../db/db");

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(403).send({ auth: false, message: "No se proveyó un token." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).send({ auth: false, message: "Token malformado." });
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if (error) {
            return res.status(500).send({ auth: false, message: "Fallo en la autenticación del token." });
        }

        console.log("Token decodificado:", decoded); // 👁️ Verifica el contenido del token

        // decoded debe tener: { id, rol }
        const { id, rol } = decoded;

        // Consultamos nombre_usuario para agregarlo a req.usuario
        const sql = "SELECT nombre_usuario FROM usuarios WHERE id_usuario = ?";
        db.query(sql, [id], (error, results) => {
            if (error) {
                return res.status(500).send({ auth: false, message: "Error al consultar el usuario." });
            }

            if (results.length === 0) {
                return res.status(404).send({ auth: false, message: "Usuario no encontrado." });
            }

            const nombre_usuario = results[0].nombre_usuario;

            // 💾 Guardamos toda la info relevante en req.usuario
            req.usuario = {
                id,
                rol,
                nombre_usuario
            };

            next();
        });
    });
};
//