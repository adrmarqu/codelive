const pool = require('../config/db');

const getContent = async (lessonId, lang) =>
{
    const result = await pool.query('SELECT * FROM content WHERE id_lesson=$1 AND land=$2', [lessonId, lang]);

    if (result.rows.length === 0) return null;
    return result.rows;
};

const postContent = async (lessonId, type, lang, content, code, codeLang) =>
{
    const exists = await getContent(lessonId, lang);
    if (exists) return false;

    const result = await pool.query('INSERT INTO content (id_lesson, type, lang, content, code, code_lang) VALUES ($1, $2, $3, $4, $5, $6)', [lessonId, type, lang, content, code, codeLang]);

    return result.rowCount > 0;
};

const putContent = async (lessonId, type, lang, content, code) =>
{
    const result = await pool.query('UPDATE content SET type=$1, lang=$2, content=$3, code=$4 WHERE id=$5', [type, lang, content, code, lessonId]);

    return result.rowCount > 0;
};

module.exports = { getContent, postContent, putContent };