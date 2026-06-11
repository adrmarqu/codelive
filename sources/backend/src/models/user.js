/* Login, signin, update, activar cuenta, gestión de usuarios */

const bcrypt = require('bcrypt');
const pool = require('../config/db');

const getUserData = async (email) =>
{
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0)
        return null;

    return result.rows[0];
};

const getUserById = async (id) =>
{
    const result = await pool.query(
        'SELECT id, username, email, rol, created_at FROM users WHERE id = $1',
        [id]
    );

    if (result.rows.length === 0)
        return null;

    return result.rows[0];
};

const checkPass = async (pass, DBPass) =>
{
    return await bcrypt.compare(pass, DBPass);
};

const userExists = async (user, email) =>
{
    const result = await pool.query('SELECT username, email FROM users WHERE username = $1 OR email = $2', [user, email]);

    return result.rows.length > 0;
};

const setUser = async (user, email, pass) =>
{
    const hash = await bcrypt.hash(pass, 10);

    await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)', [user, email, hash]);
};

/* ¿Está el username cogido por OTRO usuario distinto a id? */
const usernameTaken = async (id, username) =>
{
    const result = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id <> $2',
        [username, id]
    );
    return result.rows.length > 0;
};

/* ¿Está el email cogido por OTRO usuario distinto a id? */
const emailTaken = async (id, email) =>
{
    const result = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id <> $2',
        [email, id]
    );
    return result.rows.length > 0;
};

const updateUsername = async (id, username) =>
{
    const result = await pool.query(
        'UPDATE users SET username = $1 WHERE id = $2',
        [username, id]
    );
    return result.rowCount > 0;
};

const updateEmail = async (id, email) =>
{
    const result = await pool.query(
        'UPDATE users SET email = $1 WHERE id = $2',
        [email, id]
    );
    return result.rowCount > 0;
};

const updatePassword = async (id, newPass) =>
{
    const hash = await bcrypt.hash(newPass, 10);
    const result = await pool.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [hash, id]
    );
    return result.rowCount > 0;
};

/* Devuelve el hash de la contraseña actual (para verificar antes de actualizar) */
const getPasswordHash = async (id) =>
{
    const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0].password_hash;
};

const deleteUser = async (id) =>
{
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
};

const updateRole = async (id, rol) =>
{
    const result = await pool.query(
        'UPDATE users SET rol = $1 WHERE id = $2',
        [rol, id]
    );
    return result.rowCount > 0;
};

/* Listado de todos los usuarios con su número de lecciones completadas */
const getAllUsers = async () =>
{
    const result = await pool.query(
        `SELECT u.id, u.username, u.email, u.rol,
                COUNT(p.id)::int AS progress
         FROM users u
         LEFT JOIN progress p ON p.id_user = u.id
         GROUP BY u.id
         ORDER BY u.id ASC`
    );
    return result.rows;
};

module.exports =
{
    getUserData,
    getUserById,
    checkPass,
    userExists,
    setUser,
    usernameTaken,
    emailTaken,
    updateUsername,
    updateEmail,
    updatePassword,
    getPasswordHash,
    deleteUser,
    updateRole,
    getAllUsers
};
