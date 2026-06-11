const pool = require('../config/db');

const getLesson = async (lessonId) =>
{
    const result = await pool.query(
        `SELECT * FROM content 
         WHERE id_lesson = $1`, 
        [lessonId]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0];
};

const postLesson = async (lessonId, title, content, code) =>
{
    const result = await pool.query(
        `INSERT INTO content (id_lesson, title, content, code)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id_lesson)
         DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            code = EXCLUDED.code`,
        [lessonId, title, content, code]
    );

    return result.rowCount > 0;
};

module.exports = { getLesson, postLesson };