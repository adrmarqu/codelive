const pool = require('../config/db');

const getLesson = async (lessonId, lang) =>
{
    const result = await pool.query(
        `SELECT * FROM content 
         WHERE id_lesson = $1 AND lang = $2`, 
        [lessonId, lang]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0];
};

const postLesson = async (lessonId, lang, title, content, code) =>
{
    // Normalize language to lowercase just in case
    const normLang = (lang || 'es').toLowerCase();
    
    const result = await pool.query(
        `INSERT INTO content (id_lesson, lang, title, content, code)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id_lesson, lang)
         DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            code = EXCLUDED.code`,
        [lessonId, normLang, title, content, code]
    );

    return result.rowCount > 0;
};

module.exports = { getLesson, postLesson };