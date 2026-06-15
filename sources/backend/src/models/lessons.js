const pool = require('../config/db');

const getLesson = async (lessonId) =>
{
    const result = await pool.query(
        `SELECT * FROM lesson_content 
         WHERE id_lesson = $1`, 
        [lessonId]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0];
};

const postLesson = async (lessonId, title, content, code) =>
{
    let codeLang = null;
    const finalCode = code || null;

    if (finalCode !== null) {
        // Query database to resolve course name based on lesson ID
        const langResult = await pool.query(
            `SELECT c.name FROM lessons l
             JOIN modules m ON l.id_module = m.id
             JOIN courses c ON m.id_course = c.id
             WHERE l.id = $1`,
            [lessonId]
        );
        if (langResult.rows.length > 0) {
            const courseName = langResult.rows[0].name.toLowerCase();
            if (courseName === 'javascript') codeLang = 'js';
            else if (courseName === 'nodejs') codeLang = 'node';
            else if (courseName === 'mysql' || courseName === 'postgresql') codeLang = 'sql';
            else codeLang = courseName; // 'html', 'css', 'php'
        }
    }

    const result = await pool.query(
        `INSERT INTO lesson_content (id_lesson, title, content, code, code_lang)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id_lesson)
         DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            code = EXCLUDED.code,
            code_lang = EXCLUDED.code_lang`,
        [lessonId, title, content, finalCode, codeLang]
    );

    return result.rowCount > 0;
};

module.exports = { getLesson, postLesson };