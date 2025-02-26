const pool = require("../config/database");

const Solicitud = {
  // Para buscar una solicitud por id
  async findByIdSolicitud(id_solicitud) {
    const sql = `SELECT * FROM Solicitud WHERE id_solicitud = ?`;
    const [rows] = await pool.execute(sql, [id_solicitud]);
    return rows; // Esto debe ser un arreglo
  },

  async findByIdGaleriaSolicitud(id_galeria_Solicitud) {
    const sql = `SELECT * FROM galeria_solicitud WHERE id_galeria_Solicitud = ?`;
    const [rows] = await pool.execute(sql, [id_galeria_Solicitud]);
    return rows; // Esto debe ser un arreglo
  },

  AllGallerySolicitudes: function(){
    return pool.execute("SELECT * FROM galeria_Solicitud")
  },

  AllTipoArticulos: function(){
    return pool.execute("SELECT * FROM tipo_articulo")
  },
  AllTiposServicio: function(){
    return pool.execute("SELECT * FROM tipo_servicio")
  },

  AllSolicitudes: function () {
    return pool.execute("SELECT * FROM Solicitud");
  },
  createAOrder: function (orderData) {
    const query = `
            INSERT INTO Solicitud (
              descripcion_falla,
              fecha_compra,
              fecha_vendimiento_garantia,
              numero_factura,
              numero_garantia,
              tipo_solicitud,
              id_marca,
              id_tipo_servicio,
              id_tipo_articulo,
              id,
              id_galeria_solicitud
              garantia_producto
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
          `;
    const values = [
      orderData.descripcion_falla || null,
      orderData.fecha_compra || null,
      orderData.fecha_vendimiento_garantia || null,
      orderData.numero_factura || null,
      orderData.numero_garantia || null,
      orderData.tipo_solicitud || null,
      orderData.id_marca || null,
      orderData.id_tipo_servicio || null,
      orderData.id_tipo_articulo || null,
      orderData.id || null,
      orderData.id_galeria_solicitud || null,
      orderData.garantia_producto || null,

    ];
    return pool.execute(query, values);
  },

  deleteSolicitudById: function (id_solicitud) {
    return pool.execute("DELETE FROM Solicitud WHERE id_solicitud = ?", [
      id_solicitud,
    ]);
  },

  findAllWithGallerySolicitudes: function () {
      const query = `
            SELECT i.*, g.url_imagenes_solicitud AS galeria_Solicitud
            FROM imagenes AS i
            LEFT JOIN solicitud AS g ON i.id_galeria_solicitud = g.id_galeria_solicitud
          `;
  
      return pool.execute(query);
    },

  update: function (id_solicitud, SolicitudData) {
    const sql = `
                UPDATE Solicitud SET 
                  descripcion_falla = ?, 
                  fecha_compra = ?, 
                  fecha_vendimiento_garantia = ?, 
                  numero_factura = ?, 
                  numero_garantia = ?, 
                  garantia_producto = ?, 
                  tecnico = ?, 
                  tipo_solicitud = ?, 
                  id_marca = ?, 
                  id_tipo_servicio = ? ,
                                    id_tipo_articulo = ? ,
                                                      id = ? ,
                                                      id_galeria_solicitud_Solicitud=?


                WHERE id_solicitud = ?
              `;

    return pool.execute(sql, [
      SolicitudData.url_imagen,
      SolicitudData.nombre_producto,
      SolicitudData.precio_producto,
      SolicitudData.descripcion_producto,
      SolicitudData.id_categoria,
      SolicitudData.cantidad_producto,
      SolicitudData.referencia_producto,
      SolicitudData.garantia_producto,
      SolicitudData.id_marca,
      SolicitudData.envio_producto,
      SolicitudData.id_galeria_solicitud_Solicitud,
      id_solicitud,
    ]);
  },
};

module.exports = Solicitud;
