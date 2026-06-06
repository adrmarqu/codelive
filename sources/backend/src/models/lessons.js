const pool = require('../config/db');

const getLessons = async (moduleId) =>
{
    const result = await pool.query('SELECT * FROM lessons WHERE id_module=$1', [moduleId]);

    if (result.rows.length === 0) return null;
    return result.rows;
};

const getLesson = async (level, moduleId) =>
{
    const result = await pool.query('SELECT * FROM lessons WHERE level=$1 AND id_module=$2', [level, moduleId]);

    if (result.rows.length === 0) return null;
    return result.rows;
};

const postLesson = async (name, level, moduleId) =>
{
    const exists = await getLesson(level, moduleId);
    if (exists) return false;

    const result = await pool.query('INSERT INTO lessons (name, level, id_module) VALUES ($1, $2, $3)', [name, level, moduleId]);
    return result.rowCount > 0;
};

const putLesson = async (id, name, level) =>
{
    const result = await pool.query('UPDATE lessons SET name=$1, level=$2 WHERE id=$3', [name, level, id]);

    return result.rowCount > 0;
};

const deleteLesson = async (id) =>
{
    const result = await pool.query('DELETE FROM lessons WHERE id=$1', [id]);

    return result.rowCount > 0;
};

module.exports = { getLessons, getLesson, postLesson, putLesson, deleteLesson };