const bcrypt = require('bcrypt');
const pool = require('../config/db');

/* Conseguir todos los modulos de un curso, si no hay modulos devuelve null */
const getModules = async (courseId) =>
{
    const result = await pool.query('SELECT * FROM modules WHERE id_course=$1', [courseId]);

    if (result.rows.length === 0) return null;
    return result;
};

/* Conseguir un modulo de un curso, sino lo encuentra devuelve null */
const getModule = async (name, courseId) =>
{
    const result = await pool.query('', [name, courseId]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
};

/* Subir un modulo, si ya existe devuelve false */
const postModule = async (name, courseId, creatorId) =>
{
    if (!getModule(name)) return false;
    await pool.query('', [name, courseId, creatorId]);
    return true;
};

/* Actualizar el nombre de un modulo, devuelve false si ese nombre ya existe */
const putModule = async (name, courseId, editorId) =>
{
    if (!getModule(name)) return false;
    await pool.query('', [name, courseId, editorId]);
    return true;
};

/* Eliminar un modulo */
const deleteModule = async (name, courseId) =>
{
    await pool.query('', [name, courseId]);
};

module.exports = { getModules, getModule, postModule, putModule, deleteModule };