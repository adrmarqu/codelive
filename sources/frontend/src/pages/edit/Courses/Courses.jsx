import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

import Button from '@/components/Common/Button/Button.jsx'
import Element from '@/components/Containers/Element/Element.jsx'

import { PATHS } from '@/routes/paths';

import { getAllCoursesRequest, postCourseRequest, putCourseRequest, deleteCourseRequest } from '@/services/edit.js'

const Courses = () =>
{
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState(false);
    const [name, setName] = useState("");

     const fetchCourses = async () =>
    {
        try
        {
            const response = await getAllCoursesRequest();
            setCourses(response.data);
        }
        catch (error)
        {
            console.error("Error al cargar los cursos:", error);
        }
    };

    useEffect(() =>
    {
        fetchCourses();
    }, []);

    const newElement = () => setNewCourse(true);
    const cancelForm = () => 
    {
        setNewCourse(false);
        setName("");
    }
    const createCourse = async (e) =>
    {
        e.preventDefault();

        setName(name.trim());

        if (!name) return;

        try
        {
            const response = await postCourseRequest(name);
            
            console.log("Curso creado:", response.data);
            
            setName('');
            cancelForm();
            
            await fetchCourses();
        }
        catch (error)
        {
            console.error("Error al crear el curso:", error);
        }
    };

    const handleUpdate = async (id, newName) =>
    {
        try
        {
            await putCourseRequest(id, newName);
            await fetchCourses();
        }
        catch (error)
        {
            console.error("Error al editar:", error);
        }
    };

    const handleDelete = async (id) =>
    {
        try
        {
            console.log("Intentando borrar ID:", id);
            await deleteCourseRequest(id);
            await fetchCourses();
        }
        catch (error)
        {
            console.error("Error al borrar:", error);
        }
    };

    return (
        <>
        <div className='edit-header'>
            <div></div>
            <h2>{t('courses')}</h2>
            <Button className="btn btn-primary" onClick={newElement}>{t('form.new')}</Button>
        </div>
        <hr />
        <div className='edit-content'>
            <form action="" onSubmit={createCourse} className={newCourse ? '' : 'hidden'}>
                <input className='edit-input' type="text" placeholder={t('form.name')} value={name} onChange={(e) => setName(e.target.value)} />

                <button className='btn btn-secondary' type='button' onClick={cancelForm}>{t('cancel')}</button>
                <button className='btn btn-primary' type='submit'>{t('create')}</button>
            </form>

            {courses && courses.map((course) => (
                <Element 
                    key={course.id}
                    title={course.name}
                    onSave={(newName) => handleUpdate(course.id, newName)}
                    onDel={async () => handleDelete(course.id)}
                    onNavigate={() => navigate(`/edit/courses/${course.name}`)}
                />
            ))}
        </div>
        </>
    );
};

export default Courses