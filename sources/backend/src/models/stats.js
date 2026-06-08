const pool = require('../config/db');

/* Ventanas temporales permitidas (whitelist para evitar inyección en INTERVAL) */
const WINDOWS = {
    daily:   '1 day',
    weekly:  '7 days',
    monthly: '30 days'
};

/* Número total de lecciones existentes en la plataforma */
const getTotalLessons = async () =>
{
    const result = await pool.query('SELECT COUNT(*)::int AS total FROM lessons');
    return result.rows[0].total;
};

/* Ranking global: usuarios ordenados por lecciones completadas (todas las fechas) */
const getGlobalRanking = async (limit = 100) =>
{
    const result = await pool.query(
        `SELECT u.username, COUNT(p.id)::int AS completed
         FROM users u
         LEFT JOIN progress p ON p.id_user = u.id
         GROUP BY u.id, u.username
         ORDER BY completed DESC, u.username ASC
         LIMIT $1`,
        [limit]
    );
    return result.rows;
};

/* Ranking por ventana temporal: lecciones completadas en los últimos N días */
const getWindowRanking = async (window, limit = 50) =>
{
    const interval = WINDOWS[window];
    if (!interval) return [];

    const result = await pool.query(
        `SELECT u.username, COUNT(p.id)::int AS completed
         FROM users u
         JOIN progress p ON p.id_user = u.id
         WHERE p.completed_at >= NOW() - INTERVAL '${interval}'
         GROUP BY u.id, u.username
         ORDER BY completed DESC, u.username ASC
         LIMIT $1`,
        [limit]
    );
    return result.rows;
};

/* Estadísticas de progreso del usuario: total, completadas, semana, mes */
const getUserStats = async (userId) =>
{
    const result = await pool.query(
        `SELECT
            (SELECT COUNT(*)::int FROM lessons) AS total,
            COUNT(p.id)::int AS completed,
            (COUNT(p.id) FILTER (WHERE p.completed_at >= NOW() - INTERVAL '7 days'))::int  AS weekly,
            (COUNT(p.id) FILTER (WHERE p.completed_at >= NOW() - INTERVAL '30 days'))::int AS monthly
         FROM progress p
         WHERE p.id_user = $1`,
        [userId]
    );

    const row = result.rows[0] || { total: 0, completed: 0, weekly: 0, monthly: 0 };
    // total viene de la subconsulta aunque no haya progreso
    if (row.total === null)
    {
        const t = await getTotalLessons();
        row.total = t;
    }
    return row;
};

/* Progreso desglosado por curso/lenguaje para un usuario */
const getProgressByCourse = async (userId) =>
{
    const result = await pool.query(
        `SELECT
            c.id   AS course_id,
            c.name AS course_name,
            COUNT(l.id)::int AS total,
            COUNT(p.id)::int AS completed
         FROM courses c
         LEFT JOIN modules m ON m.id_course = c.id
         LEFT JOIN lessons l ON l.id_module = m.id
         LEFT JOIN progress p ON p.id_lesson = l.id AND p.id_user = $1
         GROUP BY c.id, c.name
         ORDER BY c.name ASC`,
        [userId]
    );
    return result.rows;
};

/* Resolver un username a su id (para que el admin vea el progreso de otro usuario) */
const getUserIdByUsername = async (username) =>
{
    const result = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return null;
    return result.rows[0].id;
};

module.exports = {
    getTotalLessons,
    getGlobalRanking,
    getWindowRanking,
    getUserStats,
    getProgressByCourse,
    getUserIdByUsername
};
