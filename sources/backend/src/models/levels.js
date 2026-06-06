const pool = require('../config/db');

/* Conseguir todos los modulos de un curso, si no hay modulos devuelve null */
const getLevels = async (moduleId) =>
{
    const result = await pool.query('SELECT * FROM lessons WHERE id_module=$1', [moduleId]);

    if (result.rows.length === 0) return null;
    return result.rows;
};

/* Conseguir un modulo de un curso, sino lo encuentra devuelve null */
const getLevel = async (moduleId, name) =>
{
    const result = await pool.query('SELECT * FROM lessons WHERE id_module=$1 AND name=$2', [moduleId, name]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
};

const getLevelById = async (levelId) =>
{
    const result = await pool.query('SELECT * FROM lessons WHERE id=$1', [levelId]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
};

const getLessonByLevel = async (moduleId, level) =>
{
    const result = await pool.query('SELECT * FROM lessons WHERE id_module=$1 AND level=$2', [moduleId, level]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
};

/* Crear niveles */
const postLevel = async (moduleId, name, level) =>
{
    try
    {
        const module = await getLevel(moduleId, name);
        if (module) return false;

        const result = await pool.query('INSERT INTO lessons (name, level, id_module) VALUES ($1, $2, $3)', [name, level, moduleId]);

        return result.rowCount > 0;
    }
    catch (error) {
        // ESTO ES LO MÁS IMPORTANTE
        console.error("ERROR SQL DETALLADO:", error.message);
        throw error; // Lanza el error para verlo en la terminal
    }
};

/* Actualizar el nombre de un modulo, devuelve false si ese nombre ya existe */
const putLevel = async (id, newName) =>
{
    const result = await pool.query(
        `UPDATE lessons SET name = $1
         WHERE id=$2`, [newName, id]
    );

    return result.rowCount > 0;
};

const changeLevel = async (a, b, levelA, levelB) =>
{
    try
    {
        await pool.query('BEGIN');
        
        // 1. A a -1
        await pool.query('UPDATE lessons SET level = -1 WHERE id = $1', [a]);
        // 2. B a levelA
        await pool.query('UPDATE lessons SET level = $1 WHERE id = $2', [levelA, b]);
        // 3. A a levelB
        await pool.query('UPDATE lessons SET level = $1 WHERE id = $2', [levelB, a]);
        
        await pool.query('COMMIT');
        return true;
    } 
    catch (e)
    {
        await pool.query('ROLLBACK');
        throw e;
    }
};

/* Eliminar un modulo */
const deleteLevel = async (levelId) =>
{
    const result = await pool.query('DELETE FROM lessons WHERE id=$1', [levelId]);

    return result.rowCount > 0;
};

module.exports = { getLevels, getLevel, getLevelById, postLevel, putLevel, deleteLevel, getLessonByLevel, changeLevel };