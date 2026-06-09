import api from './api.js';

// Courses -> /api/edit/courses

// Conseguir todos los cursos
export const getAllCoursesRequest = () => 
    api.get('/api/edit/courses');

// Crear un curso
export const postCourseRequest = (name) => 
    api.post('/api/edit/courses', { name });

// Actualizar el nombre de un curso
export const putCourseRequest = (courseId, name) => 
    api.put(`/api/edit/courses/${courseId}`, { name });

// Eliminar un curso
export const deleteCourseRequest = (courseId) => 
    api.delete(`/api/edit/courses/${courseId}`);

// Conseguir un curso
export const getCourseRequest = (courseName) => 
    api.get(`/api/edit/courses/course/${courseName}`);


// Modules -> /api/edit/modules

// Conseguir todos los modulos
export const getAllModulesRequest = (courseId) => 
    api.get(`/api/edit/modules/${courseId}`);

// Crear un modulo
export const postModuleRequest = (courseId, moduleName) => 
    api.post(`/api/edit/modules/${courseId}`, { moduleName });

// Actualizar nombre de un modulo
export const putModuleRequest = (moduleId, moduleNewName) => 
    api.put(`/api/edit/modules/${moduleId}`, { moduleNewName });

// Eliminar un modulo
export const deleteModuleRequest = (moduleId) => 
    api.delete(`/api/edit/modules/${moduleId}`);

// Conseguir un modulo
export const getModuleRequest = (courseId, moduleName) => 
    api.get(`/api/edit/modules/${courseId}/${moduleName}`);


// Levels -> /api/edit/levels

// Obtener todos los niveles de un módulo
export const getAllLevelsRequest = (moduleId, lang) => 
    api.get(`/api/edit/levels/${lang}/${moduleId}`);

export const getLevelRequest = (moduleId, level, lang) =>
    api.get(`/api/edit/levels/${lang}/${moduleId}/${level}`);

// Crear un nuevo nivel
export const postLevelRequest = (moduleId, level, type) => 
    api.post(`/api/edit/levels/${moduleId}`, { level, type });

// Mover un nivel una posicion (Swap)
export const swapLevelRequest = (moduleId, levelId, direction) => 
    api.put(`/api/edit/levels/swap/${moduleId}`, { levelId, direction });

// Mover un nivel y actualizar type
export const putLevelRequest = (moduleId, levelId, level, newLevel, newType) => 
    api.put(`/api/edit/levels/${moduleId}`, { levelId, level, newLevel, newType });

// Eliminar un nivel
export const deleteLevelRequest = (levelId) => 
    api.delete(`/api/edit/levels/${levelId}`);


// Lesson -> /api/edit/lesson

export const getLessonRequest = (levelId) =>
    api.get(`/api/edit/lesson/${levelId}`);

export const postLessonRequest = (levelId, lang, title, content, code) =>
    api.post(`/api/edit/lesson/${levelId}`, {lang, title, content, code});

export const putLessonRequest = (levelId, lang, title, content, code) =>
    api.put(`/api/edit/lesson/${levelId}`, {lang, title, content, code});