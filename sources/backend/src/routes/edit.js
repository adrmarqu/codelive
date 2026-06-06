/* course, module, levels, lesson */
const express = require('express');
const router = express.Router();

const { getAllCourses, postOneCourse, putOneCourse, deleteOneCourse } = require('../controllers/courses.js');
const { getAllModules } = require('../controllers/modules.js');

/* Courses */
router.get('/courses', getAllCourses);
router.post('/courses', postOneCourse);
router.put('/courses/:courseId', putOneCourse);
router.delete('/courses/:courseId', deleteOneCourse);

/* Modules */
router.get('/courses/:courseId/modules', getAllModules);

module.exports = router;