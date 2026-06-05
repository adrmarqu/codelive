const bcrypt = require('bcrypt');
const pool = require('../config/db');

const getLessons = async (moduleId) =>
{
};

const getLesson = async (moduleId, level) =>
{
};

const postLesson = async (name, type, moduleId, level, creatorId) =>
{
};

const putLessons = async (lessonList, moduleId) =>
{
};

/* Eliminar un nivel */
const deleteLesson = async (moduleId, level) =>
{
};

module.exports = { getLessons, getLesson, postLesson, putLessons, deleteLesson };