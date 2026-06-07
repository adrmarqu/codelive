const pool = require('../config/db');

const getLesson = async (lessonId) =>
{
    const result = await pool.query('SELECT * FROM lessons WHERE id_lesson=$1', [lessonId]);

    if (result.rows.length === 0) return null;
    return result.rows;
};

const postLesson = async (lessonId, lang, title, content, code) =>
{
    const exists = await getLesson(lessonId);
    if (exists) return false;

    const result = await pool.query('INSERT INTO lessons (id_lesson, lang, title, content, code) VALUES ($1, $2, $3, $4, $5)', [lessonId, lang, title, content, code]);

    return result.rowCount > 0;
};

const putLesson = async (lessonId, lang, title, content, code) =>
{
    const result = await pool.query('UPDATE lessons SET lang=$1, title=$2, content=$3, code=$4 WHERE id=$5', [lang, title, content, code, lessonId]);

    return result.rowCount > 0;
};

module.exports = { getLesson, postLesson, putLesson };