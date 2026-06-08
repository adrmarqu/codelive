const pool = require('../config/db');

const getContent = async (lessonId, lang) =>
{
    const normLang = (lang || 'es').toLowerCase();
    const result = await pool.query('SELECT * FROM content WHERE id_lesson=$1 AND lang=$2', [lessonId, normLang]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
};

const postContent = async (lessonId, title, lang, content, code, codeLanguage) =>
{
    const normLang = (lang || 'es').toLowerCase();
    const exists = await getContent(lessonId, normLang);
    if (exists) return false;

    const result = await pool.query(
        'INSERT INTO content (id_lesson, title, lang, content, code, code_language) VALUES ($1, $2, $3, $4, $5, $6)', 
        [lessonId, title, normLang, content, code, codeLanguage]
    );

    return result.rowCount > 0;
};

const putContent = async (lessonId, title, lang, content, code, codeLanguage) =>
{
    const normLang = (lang || 'es').toLowerCase();
    const result = await pool.query(
        'UPDATE content SET title=$1, content=$2, code=$3, code_language=$4 WHERE id_lesson=$5 AND lang=$6', 
        [title, content, code, codeLanguage, lessonId, normLang]
    );

    return result.rowCount > 0;
};

module.exports = { getContent, postContent, putContent };