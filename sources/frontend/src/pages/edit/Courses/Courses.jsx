import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCoursesRequest, deleteCourseRequest } from '@/services/courses.js'

const Courses = ({ onEdit }) =>
{
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    // Cargar cursos al montar el componente
    useEffect(() => { loadCourses(); }, []);

    const loadCourses = async () =>
    {
        const res = await getAllCoursesRequest();
        setCourses(res.data);
    };

    const handleDelete = async (id) =>
    {
        if (window.confirm('¿Estás seguro de eliminar este curso?'))
        {
            await deleteCourseRequest(id);
            loadCourses(); // Recargar lista tras borrar
        }
    };

    return (
        <div className="courses-list">
            {courses.map((course) => (
                <div 
                    key={course.id} 
                    className="item-row" 
                    onClick={() => navigate(`/edit/courses/${course.id}`)}
                >
                    <span>{course.name}</span>
                    
                    <div className="buttons" onClick={(e) => e.stopPropagation()}>
                        {/* El botón de Editar llama a la función que viene de Create.jsx */}
                        <button onClick={() => onEdit(course)}>Editar</button>
                        
                        <button onClick={() => handleDelete(course.id)}>Del</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Courses