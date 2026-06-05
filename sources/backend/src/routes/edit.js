/* course, module, levels, lesson */
const express = require('express');
const router = express.Router();

const { getAllCourses, getOneCourse, postOneCourse } = require('../controllers/courses.js');
const { getAllModules } = require('../controllers/modules.js');

/* Courses */
router.get('/courses', getAllCourses);
router.get('/courses/:courseId', getOneCourse);
router.post('/courses/:creator/:courseName', postOneCourse);

/* Modules */
router.get('/courses/:courseId/modules', getAllModules);

module.exports = router;