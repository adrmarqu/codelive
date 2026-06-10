/* course, module, levels, lesson */
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/middleware');

const { 
    getOneCourse, 
    getAllCourses, 
    postOneCourse, 
    putOneCourse, 
    deleteOneCourse 
} = require('../controllers/courses.js');

const { 
    getAllModules, 
    postOneModule, 
    putOneModule, 
    deleteOneModule, 
    getOneModule 
} = require('../controllers/modules.js');

const { 
    getOneLevel,
    getAllLevels, 
    postOneLevel, 
    putTwoLevels, 
    swapTwoLevels, 
    deleteOneLevel 
} = require('../controllers/levels.js');

const {
    getOneLesson, 
    postOneLesson, 
    putOneLesson
} = require('../controllers/lesson.js');

// Apply protection to all edit routes - only logged-in editors/admins can modify content
router.use(protect);
router.use(restrictTo('editor', 'admin'));

/* Courses */
router.get('/courses', getAllCourses);
router.get('/courses/course/:courseName', getOneCourse); 

router.post('/courses', postOneCourse);

router.put('/courses/:courseId', putOneCourse);

router.delete('/courses/:courseId', deleteOneCourse);


/* Modules */
router.get('/modules/:courseId', getAllModules); 
router.get('/modules/:courseId/:moduleName', getOneModule); 

router.post('/modules/:courseId', postOneModule);

router.put('/modules/:moduleId', putOneModule);

router.delete('/modules/:moduleId', deleteOneModule);


/* Levels */
router.get('/levels/:lang/:moduleId', getAllLevels);
router.get('/levels/:lang/:moduleId/:level', getOneLevel);

router.post('/levels/:moduleId', postOneLevel);

// Fix route collision: swap route must come before the parameterized level route
router.put('/levels/swap/:moduleId', swapTwoLevels);
router.put('/levels/:moduleId', putTwoLevels);

router.delete('/levels/:levelId', deleteOneLevel);


/* Lesson */
router.get('/lesson/:lang/:levelId', getOneLesson);

router.post('/lesson/:levelId', postOneLesson);

module.exports = router;