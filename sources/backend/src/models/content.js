const bcrypt = require('bcrypt');
const pool = require('../config/db');

const getContent = async (lessonId, lang) =>
{
};

const postContent = async (lessonId, lang, lessonType, title, content, code, code_language) =>
{
};

const putContent = async (lessonId, lang, lessonType, title, content, code, code_language) =>
{
};

const deleteContent = async (lessonId) =>
{
};

module.exports = { getContent, postContent, putContent, deleteContent };