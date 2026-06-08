/* Ranking y progreso */

const {
    getTotalLessons,
    getGlobalRanking,
    getWindowRanking,
    getUserStats,
    getProgressByCourse,
    getUserIdByUsername
} = require('../models/stats.js');

/* Límite de resultados por tipo de ranking (según diseño) */
const LIMITS = { global: 100, monthly: 50, weekly: 20, daily: 10 };

const getRanking = async (req, res) =>
{
    const type = (req.query.type || 'global').toLowerCase();

    try
    {
        if (type === 'global')
        {
            const total = await getTotalLessons();
            const rows = await getGlobalRanking(LIMITS.global);

            const ranking = rows.map(r => ({
                username: r.username,
                value: total > 0 ? Math.round((r.completed / total) * 100) : 0,
                unit: 'percent'
            }));

            return res.status(200).json({ type, ranking });
        }

        if (type === 'daily' || type === 'weekly' || type === 'monthly')
        {
            const rows = await getWindowRanking(type, LIMITS[type]);
            const ranking = rows.map(r => ({
                username: r.username,
                value: r.completed,
                unit: 'levels'
            }));

            return res.status(200).json({ type, ranking });
        }

        return res.status(400).json({ message: "Tipo de ranking no válido" });
    }
    catch (error)
    {
        console.error("Error al obtener ranking:", error);
        return res.status(500).json({ message: "Internal error" });
    }
};

/* Construye el objeto de progreso para un userId concreto */
const buildProgress = async (userId) =>
{
    const stats = await getUserStats(userId);
    const courses = await getProgressByCourse(userId);

    const percent = stats.total > 0
        ? Math.round((stats.completed / stats.total) * 100)
        : 0;

    const coursesWithPercent = courses.map(c => ({
        course_id: c.course_id,
        course_name: c.course_name,
        total: c.total,
        completed: c.completed,
        percent: c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0
    }));

    return {
        total: stats.total,
        completed: stats.completed,
        weekly: stats.weekly,
        monthly: stats.monthly,
        percent,
        courses: coursesWithPercent
    };
};

/* Progreso del usuario autenticado */
const getProgress = async (req, res) =>
{
    try
    {
        const progress = await buildProgress(req.user.id);
        return res.status(200).json(progress);
    }
    catch (error)
    {
        console.error("Error al obtener progreso:", error);
        return res.status(500).json({ message: "Internal error" });
    }
};

/* Progreso de un usuario concreto por username (solo admin) */
const getProgressByUsername = async (req, res) =>
{
    const { username } = req.params;
    try
    {
        const userId = await getUserIdByUsername(username);
        if (!userId)
            return res.status(404).json({ message: "Usuario no encontrado" });

        const progress = await buildProgress(userId);
        return res.status(200).json({ ...progress, username });
    }
    catch (error)
    {
        console.error("Error al obtener progreso del usuario:", error);
        return res.status(500).json({ message: "Internal error" });
    }
};

module.exports = { getRanking, getProgress, getProgressByUsername };
