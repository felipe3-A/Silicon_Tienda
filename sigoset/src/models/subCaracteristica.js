const db = require("../config/database");

const Subcaracteristica = {

    getAll: function () {
      return db.execute("SELECT * FROM subcaracteristica");
    },
  getById: (id) => {
    db.query("SELECT * FROM subcaracteristica WHERE id_subcaracteristica = ?", [id], callback);
  },
  create: function(subCaracteristicaData){
    const sql= " INSERT INTO subcaracteristica(nombre_subcaracteristica, id_caracteristica) VALUES (?,?)";
    return db.execute(sql,[
      subCaracteristicaData.nombre_subcaracteristica,
      subCaracteristicaData.id_caracteristica
    ])
}
}
module.exports = Subcaracteristica;
