import axios from 'axios'

const api = axios.create(
{
    baseURL: 'http://localhost:3000/api/edit' 
});

// GET /courses
export const getAllCoursesRequest = () => api.get('/courses');

// POST /courses
export const postCourseRequest = (name) => api.post('/courses', { name });

// PUT /courses/:id
export const putCourseRequest = (id, name) => api.put(`/courses/${id}`, { name });

// DELETE /courses/:id
export const deleteCourseRequest = (id) => api.delete(`/courses/${id}`);