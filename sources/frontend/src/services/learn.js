import api from './api.js';

// Obtener todos los cursos
export const getCoursesLearn = () => 
    api.get('/api/learn/courses');

// Obtener un curso específico por nombre
export const getCourseLearn = (courseName) => 
    api.get(`/api/learn/courses/course/${courseName}`);

// Obtener todos los módulos de un curso
export const getModulesLearn = (courseId) => 
    api.get(`/api/learn/modules/${courseId}`);

// Obtener un módulo específico
export const getModuleLearn = (courseId, moduleName) => 
    api.get(`/api/learn/modules/${courseId}/${moduleName}`);

// Obtener todos los niveles (lecciones) de un módulo
export const getLevelsLearn = (moduleId) => 
    api.get(`/api/learn/levels/${moduleId}`);

// Obtener un nivel específico de un módulo
export const getLevelLearn = (moduleId, level) => 
    api.get(`/api/learn/levels/${moduleId}/${level}`);

// Obtener el contenido detallado de una lección (levelId)
export const getLessonLearn = (levelId) => 
    api.get(`/api/learn/lesson/${levelId}`);

// Obtener la lista de IDs de lecciones completadas por el usuario
export const getProgressLearn = () => 
    api.get('/api/learn/progress');

// Guardar progreso marcando una lección como completada
export const saveProgressLearn = (levelId) => 
    api.post(`/api/learn/progress/${levelId}`);
