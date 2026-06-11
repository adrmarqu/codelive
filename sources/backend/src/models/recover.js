/* Modelo para la tabla password_resets */

const crypto = require('crypto');
const pool = require('../config/db');

/**
 * Crea un token de recuperación para el usuario con ese email.
 * Invalida tokens anteriores del mismo usuario.
 * Devuelve el token generado, o null si el email no existe.
 */
const createResetToken = async (email) =>
{
    /* Buscar usuario */
    const userResult = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
    );

    if (userResult.rows.length === 0)
        return null;

    const userId = userResult.rows[0].id;

    /* Invalidar tokens anteriores */
    await pool.query(
        'UPDATE password_resets SET used = TRUE WHERE id_user = $1 AND used = FALSE',
        [userId]
    );

    /* Generar token seguro */
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await pool.query(
        'INSERT INTO password_resets (id_user, token, expires_at) VALUES ($1, $2, $3)',
        [userId, token, expiresAt]
    );

    return token;
};

/**
 * Valida un token: existe, no usado y no expirado.
 * Devuelve el id_user si es válido, o null si no.
 */
const validateResetToken = async (token) =>
{
    const result = await pool.query(
        `SELECT id_user FROM password_resets
         WHERE token = $1
           AND used = FALSE
           AND expires_at > NOW()`,
        [token]
    );

    if (result.rows.length === 0)
        return null;

    return result.rows[0].id_user;
};

/**
 * Marca el token como usado (después de cambiar la contraseña).
 */
const markTokenUsed = async (token) =>
{
    await pool.query(
        'UPDATE password_resets SET used = TRUE WHERE token = $1',
        [token]
    );
};

module.exports = { createResetToken, validateResetToken, markTokenUsed };
