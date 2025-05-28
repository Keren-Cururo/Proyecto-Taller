const db = require("../db/db");

// Obtener todos los servicios
const allServicio = (req, res) => {
  const sql = "SELECT * FROM servicios";
  db.query(sql, (error, rows) => {
    if (error) {
      return res.status(500).json({ error: "ERROR: Intente más tarde por favor" });
    }
    res.json(rows);
  });
};

// Obtener un servicio por id
const showServicio = (req, res) => {
  const { id_servicio } = req.params;
  const sql = "SELECT * FROM servicios WHERE id_servicio = ?";
  db.query(sql, [id_servicio], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: "ERROR: Intente más tarde por favor" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "ERROR: No existe el servicio buscado" });
    }
    res.json(rows[0]);
  });
};

// Crear servicio
const storeServicio = (req, res) => {
  let imageName = "";

  if (req.file) {
    imageName = req.file.filename;
  }

  const { nombre_servicio, descripcion, fecha_alta } = req.body;
  const fechaAltaServicio = fecha_alta || new Date().toISOString().slice(0, 19).replace("T", " ");

  const sql = "INSERT INTO servicios (nombre_servicio, descripcion, fecha_alta, imagen) VALUES (?, ?, ?, ?)";
  db.query(sql, [nombre_servicio, descripcion, fechaAltaServicio, imageName], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "ERROR: Intente más tarde por favor" });
    }
    const servicio = {
      id_servicio: result.insertId,
      nombre_servicio,
      descripcion,
      fecha_alta: fechaAltaServicio,
      imagen: imageName,
    };
    res.status(201).json(servicio);
  });
};

// Actualizar servicio
const updateServicio = (req, res) => {
  const { id_servicio } = req.params;
  const { nombre_servicio, descripcion, fecha_alta, imagen } = req.body;

  // Aquí mantenemos la imagen actual a menos que venga una nueva en req.file
  let imageName = imagen || "";
  if (req.file) {
    imageName = req.file.filename;
  }

  // Construir la consulta condicionalmente para actualizar o no la imagen
  let sql = "";
  let values = [];

  if (imageName) {
    sql = `UPDATE servicios SET nombre_servicio = ?, descripcion = ?, fecha_alta = ?, imagen = ? WHERE id_servicio = ?`;
    values = [nombre_servicio, descripcion, fecha_alta, imageName, id_servicio];
  } else {
    sql = `UPDATE servicios SET nombre_servicio = ?, descripcion = ?, fecha_alta = ? WHERE id_servicio = ?`;
    values = [nombre_servicio, descripcion, fecha_alta, id_servicio];
  }

  db.query(sql, values, (error, result) => {
    if (error) {
      return res.status(500).json({ error: "ERROR: Intente más tarde por favor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ERROR: El servicio a modificar no existe" });
    }

    // Traemos el servicio actualizado para devolverlo completo
    const sqlSelect = "SELECT * FROM servicios WHERE id_servicio = ?";
    db.query(sqlSelect, [id_servicio], (error, rows) => {
      if (error) {
        return res.status(500).json({ error: "Error: intente más tarde" });
      }
      res.json(rows[0]);
    });
  });
};

// Eliminar servicio
const destroyServicio = (req, res) => {
  const { id_servicio } = req.params;
  const sql = "DELETE FROM servicios WHERE id_servicio = ?";
  db.query(sql, [id_servicio], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "ERROR: Intente más tarde por favor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ERROR: El servicio a borrar no existe" });
    }
    res.json({ mensaje: "Servicio eliminado" });
  });
};

module.exports = {
  allServicio,
  showServicio,
  storeServicio,
  updateServicio,
  destroyServicio,
};
