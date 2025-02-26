const pool = require('../config/database');

const ModuloXPerfil = {
    findAll: async function() {
        try {
            const sql = `
                SELECT m.*, p.*, mxp.*
                FROM moduloxperfil mxp
                JOIN modulo m ON mxp.idmodulo = m.idmodulo
                JOIN perfil p ON mxp.idperfil = p.idperfil
            `;
            const [rows, fields] = await pool.execute(sql);
            return rows;
        } catch (error) {
            throw error;
        }
    },
    findById: async function(idModulo, idPerfil) {
        try {
            const [rows, fields] = await pool.execute('SELECT * FROM moduloxperfil WHERE idmodulo = ? AND idperfil = ?', [idModulo, idPerfil]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },
    create: async function(moduloxperfilData) {
        try {
            const { idmodulo, idperfil, permiso } = moduloxperfilData;
            const sql = `INSERT INTO moduloxperfil (idmodulo, idperfil, permiso) VALUES (?, ?, ?)`;
            const result = await pool.execute(sql, [idmodulo, idperfil, permiso]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },
    update: async function(idModulo, idPerfil, moduloxperfilData) {
        try {
            const { permiso } = moduloxperfilData;
            const sql = `UPDATE moduloxperfil SET permiso = ? WHERE idmodulo = ? AND idperfil = ?`;
            const result = await pool.execute(sql, [permiso, idModulo, idPerfil]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    },
    deleteById: async function(idModulo, idPerfil) {
        try {
            const result = await pool.execute('DELETE FROM moduloxperfil WHERE idmodulo = ? AND idperfil = ?', [idModulo, idPerfil]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = ModuloXPerfil;
