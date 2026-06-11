const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');

const { getCourses, getCourse } = require('../models/courses.js');
const { getModules, getModule } = require('../models/modules.js');
const { getLevels, getLevel } = require('../models/levels.js');
const { getLesson } = require('../models/lessons.js');
const { saveProgress, getUserProgress } = require('../models/progres.js');
const { runCode } = require('../controllers/runner.js');

// Apply protection to all learn routes - users must be logged in to access learning content
/* router.use(protect); */

/* Courses */
router.get('/courses', async (req, res) => {
    try {
        const courses = await getCourses();
        return res.status(200).json(courses || []);
    } catch (error) {
        console.error("Error al obtener cursos:", error);
        return res.status(500).json({ error: "Internal error" });
    }
});

router.get('/courses/course/:courseName', async (req, res) => {
    const { courseName } = req.params;
    try {
        const course = await getCourse(courseName);
        if (!course) return res.status(404).json({ error: "Curso no encontrado" });
        return res.status(200).json(course);
    } catch (error) {
        console.error("Error al obtener curso:", error);
        return res.status(500).json({ error: "Internal error" });
    }
});

/* Modules */
router.get('/modules/:courseId', async (req, res) => {
    const { courseId } = req.params;
    try {
        const modules = await getModules(courseId);
        return res.status(200).json(modules || []);
    } catch (error) {
        console.error("Error al obtener módulos:", error);
        return res.status(500).json({ error: "Internal error" });
    }
});

router.get('/modules/:courseId/:moduleName', async (req, res) => {
    const { courseId, moduleName } = req.params;
    try {
        const module = await getModule(courseId, moduleName);
        if (!module) return res.status(404).json({ error: "Módulo no encontrado" });
        return res.status(200).json(module);
    } catch (error) {
        console.error("Error al obtener módulo:", error);
        return res.status(500).json({ error: "Internal error" });
    }
});

/* Levels */
router.get('/levels/:moduleId', async (req, res) => {
    const { moduleId } = req.params;
    try {
        const levels = await getLevels(moduleId);
        return res.status(200).json(levels || []);
    } catch (error) {
        console.error("Error al obtener niveles:", error);
        return res.status(500).json({ error: "Internal error" });
    }
});

router.get('/levels/:moduleId/:level', async (req, res) => {
    const { moduleId, level } = req.params;
    try {
        const levelData = await getLevel(moduleId, level);
        if (!levelData) return res.status(404).json({ error: "Nivel no encontrado" });
        return res.status(200).json(levelData);
    } catch (error) {
        console.error("Error al obtener nivel:", error);
        return res.status(500).json({ error: "Internal error" });
    }
});

/* Lesson Content */
router.get('/lesson/:levelId', async (req, res) => {
    const { levelId } = req.params;
    try {
        const lesson = await getLesson(levelId);
        if (!lesson) return res.status(404).json({ error: "Lección no encontrada" });
        return res.status(200).json(lesson);
    } catch (error) {
        console.error("Error al obtener lección:", error);
        return res.status(500).json({ error: "Internal error" });
    }
});

/* Progress */
router.get('/progress', protect, async (req, res) => {
    try {
        const completedIds = await getUserProgress(req.user.id);
        return res.status(200).json(completedIds || []);
    } catch (error) {
        console.error("Error al obtener progreso:", error);
        return res.status(500).json({ error: "Internal error" });
    }
});

router.post('/progress/:levelId', protect, async (req, res) => {
    const { levelId } = req.params;
    try {
        await saveProgress(req.user.id, levelId);
        return res.status(200).json({ message: "Progreso guardado con éxito" });
    } catch (error) {
        console.error("Error al guardar progreso:", error);
        return res.status(500).json({ error: "Internal error" });
    }
});

/* Code Runner playground execution */
router.post('/run', runCode);

module.exports = router;
