/* Login, signin, update, activar cuenta */

const bcrypt = require('bcrypt');
const pool = require('../config/db');

const getUserData = async (email) =>
{
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

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

    console.log('Buscando usuario:', user, email, 'Resultado:', result.rows);
    return result.rows.length > 0;
};

const setUser = async (user, email, pass) =>
{
    const hash = await bcrypt.hash(pass, 10);

    await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)', [user, email, hash]);
};

module.exports = { getUserData, checkPass, userExists, setUser };
