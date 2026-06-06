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


// Modules -> /courses/modules/:id

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


// Levels -> /courses/levels/:id

// Obtener todos los niveles de un módulo
export const getAllLevelsRequest = (moduleId) => 
    api.get(`/levels/${moduleId}`);

// Crear un nuevo nivel
export const postLevelRequest = (moduleId, levelName, level) => 
    api.post(`/levels/${moduleId}`, { levelName, level });

// Actualizar el nombre de un nivel
export const putLevelRequest = (levelId, levelName) => 
    api.put(`/levels/${levelId}`, { levelName });

// Mover un nivel (Swap)
export const moveLevelRequest = (moduleId, levelId, direction) => 
    api.put(`/levels/${moduleId}/${levelId}`, { direction });

// Eliminar un nivel
export const deleteLevelRequest = (levelId) => 
    api.delete(`/levels/${levelId}`);
