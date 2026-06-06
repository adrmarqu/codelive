/* course, module, levels, lesson */
const express = require('express');
const router = express.Router();

const { getOneCourse, getAllCourses, postOneCourse, putOneCourse, deleteOneCourse } = require('../controllers/courses.js');
const { getAllModules, postOneModule, putOneModule, deleteOneModule, getOneModule } = require('../controllers/modules.js');
const { getAllLevels, postOneLevel, putOneLevel, swapTwoLevels, deleteOneLevel } = require('../controllers/levels.js');

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

router.post('/levels/:moduleId', postOneLevel);

router.put('/levels/:levelId', putOneLevel);
router.put('/levels/:moduleId/:levelId', swapTwoLevels);

router.delete('/levels/:levelId', deleteOneLevel);

module.exports = router;