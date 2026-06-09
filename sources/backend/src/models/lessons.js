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
    
    // Check if translation already exists
    const existsResult = await pool.query(
        'SELECT * FROM content WHERE id_lesson = $1 AND lang = $2',
        [lessonId, normLang]
    );

    if (existsResult.rows.length > 0) {
        // Update instead
        const result = await pool.query(
            'UPDATE content SET title = $1, content = $2, code = $3 WHERE id_lesson = $4 AND lang = $5',
            [title, content, code, lessonId, normLang]
        );
        return result.rowCount > 0;
    }

    const result = await pool.query(
        'INSERT INTO content (id_lesson, lang, title, content, code) VALUES ($1, $2, $3, $4, $5)',
        [lessonId, normLang, title, content, code]
    );

    return result.rowCount > 0;
};

const putLesson = async (lessonId, lang, title, content, code) =>
{
    const normLang = (lang || 'es').toLowerCase();
    
    const result = await pool.query(
        'UPDATE content SET title = $1, content = $2, code = $3 WHERE id_lesson = $4 AND lang = $5',
        [title, content, code, lessonId, normLang]
    );

    if (result.rowCount === 0) {
        // If it didn't exist, insert it
        const insertResult = await pool.query(
            'INSERT INTO content (id_lesson, lang, title, content, code) VALUES ($1, $2, $3, $4, $5)',
            [lessonId, normLang, title, content, code]
        );
        return insertResult.rowCount > 0;
    }

    return result.rowCount > 0;
};

module.exports = { getLesson, postLesson, putLesson };