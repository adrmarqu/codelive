const pool = require('../config/db');

/* Conseguir todos los modulos de un curso, si no hay modulos devuelve null */
const getLevels = async (moduleId) =>
{
    const query = `
        SELECT l.*, lc.title 
        FROM lessons l 
        LEFT JOIN lesson_content lc ON l.id = lc.id_lesson 
        WHERE l.id_module=$1
        ORDER BY l.level ASC
    `;
    const result = await pool.query(query, [moduleId]);

    if (result.rows.length === 0) return null;
    return result.rows;
};


const getMaxLevel = async (moduleId) =>
{
    console.log("-> Executing MAX(level) query for moduleId:", moduleId);

    const query = `SELECT MAX(level) AS max_level FROM lessons WHERE id_module = $1`;
    const result = await pool.query(query, [moduleId]);

    const valor = result.rows[0].max_level;

    console.log("-> MAX(level) query result:", valor);

    return valor !== null ? parseInt(valor, 10) : 0;
};

/* Conseguir un nivel específico de un módulo con SOLO su título (Sin contenido ni código) */
const getLevel = async (moduleId, level) =>
{
    console.log(`-> getLevel called with moduleId: ${moduleId}, level: ${level}`);
    const query = `SELECT * FROM lessons WHERE id_module=$1 AND level=$2`;

    const result = await pool.query(query, [moduleId, level]);
    console.log(`-> getLevel result rowCount:`, result.rowCount);

    if (result.rows.length === 0) return null;
    return result.rows[0];
};

const getLevelById = async (levelId) =>
{
    const result = await pool.query('SELECT * FROM lessons WHERE id=$1', [levelId]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
};

/* Crear niveles */
const postLevel = async (moduleId, level) =>
{
    try
    {
        console.log("-> Checking if level already exists...");
        const module = await getLevel(moduleId, level);
        if (module) {
            console.log("-> Level already exists, returning false");
            return false;
        }

        console.log(`-> Executing INSERT INTO lessons (level, id_module) VALUES (${level}, ${moduleId})`);
        const result = await pool.query('INSERT INTO lessons (level, id_module) VALUES ($1, $2)', [level, moduleId]);
        console.log("-> INSERT result rowCount:", result.rowCount);

        return result.rowCount > 0;
    }
    catch (error) {
        console.error("-> ERROR SQL EN postLevel:", error.message);
        console.error("-> Error code:", error.code);
        console.error("-> Error detail:", error.detail);
        throw error;
    }
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

const resequenceLevels = async (moduleId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Fetch all levels for this module sorted by level
        const res = await client.query('SELECT id, level FROM lessons WHERE id_module = $1 ORDER BY level ASC', [moduleId]);
        
        // Set all of them to a temporary negative/offset level first to avoid any unique constraint conflicts
        for (let i = 0; i < res.rows.length; i++) {
            const row = res.rows[i];
            await client.query('UPDATE lessons SET level = $1 WHERE id = $2', [-(i + 1), row.id]);
        }
        
        // Set them to their correct sequential level numbers (1, 2, 3, ...)
        for (let i = 0; i < res.rows.length; i++) {
            const row = res.rows[i];
            await client.query('UPDATE lessons SET level = $1 WHERE id = $2', [i + 1, row.id]);
        }
        
        await client.query('COMMIT');
        return true;
    } catch (e) {
        await client.query('ROLLBACK');
        console.error("Error resequencing levels:", e);
        throw e;
    } finally {
        client.release();
    }
};

const updateLevelNumber = async (levelId, newLevel) => {
    const result = await pool.query('UPDATE lessons SET level = $1 WHERE id = $2', [newLevel, levelId]);
    return result.rowCount > 0;
};

module.exports = { getMaxLevel, getLevels, getLevel, getLevelById, postLevel, deleteLevel, changeLevel, resequenceLevels, updateLevelNumber };