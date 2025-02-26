const db = require("../config/database");

const Caracteristica = {
  getAll: function () {
    return db.execute("SELECT * FROM caracteristica");
  },
  getById: (id) => {
    db.query("SELECT * FROM caracteristica WHERE id_caracteristica = ?", [id]);
  },
  create: (nombre, id_categoria) => {
    db.query("INSERT INTO caracteristica (nombre_caracteristica, id_categoria) VALUES (?, ?)", 
    [nombre, id_categoria]);
  },
    // Nueva función para obtener características por categoría
    getByCategoria: (id_categoria, callback) => {
      db.query("SELECT * FROM caracteristica WHERE id_categoria = ?", [id_categoria], callback);
    },

     // Nueva función para obtener características por categoría
  getByCategoria: (id_categoria, callback) => {
    db.query("SELECT * FROM caracteristica WHERE id_categoria = ?", [id_categoria], callback);
  },
};

module.exports = Caracteristica;
