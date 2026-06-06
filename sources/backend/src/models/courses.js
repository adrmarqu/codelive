const pool = require('../config/db');

/* Conseguir todos los cursos, si no hay cursos devuelve null */
const getCourses = async () =>
{
    const result = await pool.query('SELECT * FROM courses');

    if (result.rows.length === 0) return null;
    return result.rows;
};

/* Conseguir un curso, sino lo encuentra devuelve null */
const getCourse = async (name) =>
{
    const result = await pool.query('SELECT * FROM courses WHERE name=$1', [name]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
};

/* Subir un curso, si ya existe devuelve false */
const postCourse = async (name) =>
{
    const courseExist = await getCourse(name);
    if (courseExist) return false;

    const result = await pool.query('INSERT INTO courses (name) VALUES ($1)', [name]);
    return result.rowCount > 0;
};

/* Actualizar el nombre de un curso, devuelve false si ese nombre ya existe */
const putCourse = async (id, newName) =>
{
    const result = await pool.query(
        `UPDATE courses SET name = $1
         WHERE id=$2`, [newName, id]
    );

    return result.rowCount > 0;
};

/* Eliminar un curso */
const deleteCourse = async (id) =>
{
    const result = await pool.query('DELETE FROM courses WHERE id=$1', [id]);

    return result.rowCount > 0;
};

module.exports = { getCourse, getCourses, postCourse, putCourse, deleteCourse };
