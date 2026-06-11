/* Contacto */

const pool = require('../config/db');

/* Guardar un mensaje de contacto enviado por un usuario */
const createContact = async (userId, comment, email) =>
{
    const id = userId ? userId : null;
    const finalEmail = email ? email : null;

    const result = await pool.query(
        'INSERT INTO contact (id_user, comment, email_guest) VALUES ($1, $2, $3) RETURNING id',
        [id, comment, finalEmail]
    );
    return result.rowCount > 0;
};

/* Obtener todos los mensajes, el más reciente primero (para el admin) */
const getAllContacts = async () =>
{
    const result = await pool.query(
        `SELECT c.id, c.comment, c.send_at, c.email_guest, u.username, u.email
         FROM contact c
         LEFT JOIN users u ON u.id = c.id_user
         ORDER BY c.send_at DESC`
    );
    return result.rows;
};

module.exports = { createContact, getAllContacts };
