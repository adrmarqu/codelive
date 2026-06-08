/* course, module, levels, lesson */
const express = require('express');
const router = express.Router();

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
router.get('/levels/:moduleId', getAllLevels);
router.get('/levels/:moduleId/:level', getOneLevel);

router.post('/levels/:moduleId', postOneLevel);

router.put('/levels/:moduleId', putTwoLevels);
router.put('/levels/swap/:moduleId/', swapTwoLevels);

router.delete('/levels/:levelId', deleteOneLevel);


/* Lesson */
router.get('/lesson/:levelId', getOneLesson);

router.post('/lesson/:levelId', postOneLesson);

router.put('/lesson/:levelId', putOneLesson);

module.exports = router;