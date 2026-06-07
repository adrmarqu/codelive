import axios from 'axios'

const api = axios.create(
{
    baseURL: 'http://localhost:3000/api/edit' 
});

// Courses -> /courses/:id

// Conseguir todos los cursos
export const getAllCoursesRequest = () => 
    api.get('/courses');

// Crear un curso
export const postCourseRequest = (name) => 
    api.post('/courses', { name });

// Actualizar el nombre de un curso
export const putCourseRequest = (courseId, name) => 
    api.put(`/courses/${courseId}`, { name });

// Eliminar un curso
export const deleteCourseRequest = (courseId) => 
    api.delete(`/courses/${courseId}`);

// Conseguir un curso
export const getCourseRequest = (courseName) => 
    api.get(`/courses/course/${courseName}`);


// Modules -> /modules/:id

// Conseguir todos los modulos
export const getAllModulesRequest = (courseId) => 
    api.get(`/modules/${courseId}`);

// Crear un modulo
export const postModuleRequest = (courseId, moduleName) => 
    api.post(`/modules/${courseId}`, { moduleName });

// Actualizar nombre de un modulo
export const putModuleRequest = (moduleId, moduleNewName) => 
    api.put(`/modules/${moduleId}`, { moduleNewName });

// Eliminar un modulo
export const deleteModuleRequest = (moduleId) => 
    api.delete(`/modules/${moduleId}`);

// Conseguir un modulo
export const getModuleRequest = (courseId, moduleName) => 
    api.get(`/modules/${courseId}/${moduleName}`);


// Levels -> /levels/:id

// Obtener todos los niveles de un módulo
export const getAllLevelsRequest = (moduleId) => 
    api.get(`/levels/${moduleId}`);

export const getLevelRequest = (moduleId, level) =>
    api.get(`/levels/${moduleId}/${level}`);

// Crear un nuevo nivel
export const postLevelRequest = (moduleId, level, type) => 
    api.post(`/levels/${moduleId}`, { level, type });

// Mover un nivel una posicion (Swap)
export const swapLevelRequest = (moduleId, levelId, direction) => 
    api.put(`/levels/swap/${moduleId}`, { levelId, direction });

// Mover un nivel y actualizar type
export const putLevelRequest = (moduleId, levelId, level, newLevel, newType) => 
    api.put(`/levels/${moduleId}`, { levelId, level, newLevel, newType });

// Eliminar un nivel
export const deleteLevelRequest = (levelId) => 
    api.delete(`/levels/${levelId}`);


// Lesson -> /lesson/:id

export const getLessonRequest = (levelId) =>
    api.get(`/lesson/${levelId}`);

export const postLessonRequest = (levelId, lang, title, content, code) =>
    api.post(`/lesson/${levelId}`, {lang, title, content, code});

export const putLessonRequest = (levelId, lang, title, content, code) =>
    api.put(`/lesson/${levelId}`, {lang, title, content, code});