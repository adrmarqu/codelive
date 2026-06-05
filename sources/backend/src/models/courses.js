const bcrypt = require('bcrypt');
const pool = require('../config/db');

/* Conseguir todos los cursos, si no hay cursos devuelve null */
const getCourses = async () =>
{
    const result = await pool.query('');

    if (result.rows.length === 0) return null;
    return result;
};

/* Conseguir un curso, sino lo encuentra devuelve null */
const getCourse = async (name) =>
{
    const result = await pool.query('', [name]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
};

/* Subir un curso, si ya existe devuelve false */
const postCourse = async (name, creatorId) =>
{
    if (!getCourse(name)) return false;
    await pool.query('', [name, creatorId]);
    return true;
};

/* Actualizar el nombre de un curso, devuelve false si ese nombre ya existe */
const putCourse = async (name, editorId) =>
{
    if (!getCourse(name)) return false;
    await pool.query('', [name, editorId]);
    return true;
};

/* Eliminar un curso */
const deleteCourse = async (name) =>
{
    await pool.query('', [name]);
};

module.exports = { getCourses, getCourse, postCourse, putCourse, deleteCourse };
