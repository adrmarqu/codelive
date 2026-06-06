const pool = require('../config/db');

/* Conseguir todos los modulos de un curso, si no hay modulos devuelve null */
const getModules = async (courseId) =>
{
    const result = await pool.query('SELECT * FROM modules WHERE id_course=$1', [courseId]);

    if (result.rows.length === 0) return null;
    return result.rows;
};

/* Conseguir un modulo de un curso, sino lo encuentra devuelve null */
const getModule = async (name, courseId) =>
{
    const result = await pool.query('SELECT * FROM modules WHERE name=$1 AND id_course=$2', [name, courseId]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
};

/* Subir un modulo, si ya existe devuelve false */
const postModule = async (name, courseId) =>
{
    const module = await getModule(name, courseId);
    if (module) return false;

    const result = await pool.query('INSERT INTO modules (name, id_course) VALUES ($1, $2)', [name, courseId]);

    return result.rowCount > 0;
};

/* Actualizar el nombre de un modulo, devuelve false si ese nombre ya existe */
const putModule = async (id, newName) =>
{
    const result = await pool.query(
        `UPDATE modules SET name = $1
         WHERE id=$2`, [newName, id]
    );

    return result.rowCount > 0;
};

/* Eliminar un modulo */
const deleteModule = async (name, courseId) =>
{
    const result = await pool.query('DELETE FROM modules WHERE name=$1 AND id_course=$2', [name, courseId]);

    return result.rowCount > 0;
};

module.exports = { getModules, getModule, postModule, putModule, deleteModule };