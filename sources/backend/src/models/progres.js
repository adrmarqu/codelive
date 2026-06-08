const pool = require('../config/db');

// Guardar progreso del usuario para una lección (levelId)
const saveProgress = async (userId, lessonId) => {
    try {
        const result = await pool.query(
            'INSERT INTO progress (id_user, id_lesson) VALUES ($1, $2) ON CONFLICT (id_user, id_lesson) DO NOTHING',
            [userId, lessonId]
        );
        return true;
    } catch (error) {
        console.error("Error al guardar progreso:", error);
        throw error;
    }
};

// Obtener todas las lecciones completadas por el usuario
const getUserProgress = async (userId) => {
    try {
        const result = await pool.query(
            'SELECT id_lesson FROM progress WHERE id_user = $1',
            [userId]
        );
        return result.rows.map(row => row.id_lesson);
    } catch (error) {
        console.error("Error al obtener progreso:", error);
        throw error;
    }
};

module.exports = { saveProgress, getUserProgress };