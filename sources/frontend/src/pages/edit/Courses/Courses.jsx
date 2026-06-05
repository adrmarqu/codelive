import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getCourses, handleCreateCourse } from '@/services/content.js'
import { PATHS } from '@/routes/paths.js'

import Form from '@/components/forms/Form/Form.jsx'
import Input from '@/components/forms/Input/Input.jsx'
import CardEdit from '@/components/containers/cardEdit/CardEdit.jsx'
import Button from '@/components/common/Button/button.jsx'

function Courses()
{
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState(false);

    const fetchCourses = async () =>
    {
        const data = await getCourses();
        if (Array.isArray(data)) setCourses(data);
    };

    useEffect(() =>
    {
        fetchCourses();
    }, []);

    const closeForm = () => setNewCourse(false);
    const goTo = (id) => { navigate(`${PATHS.EDIT.COURSE}/${id}`); };

    const getUserId = () =>
    {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString).id : null;
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
                
        const creatorId = getUserId() || 1;
        const courseName = data.course;

        if (!courseName) {
            console.error("Error: el nombre del curso está vacío");
            return;
        }

        const isSuccess = await handleCreateCourse(data, creatorId);

        if (isSuccess)
        {
            await fetchCourses();
            console.log("CURSOS:", courses);
            setNewCourse(false);
        }
    };

    return (
        <>
        {!newCourse && (
        <section className="edit-container">
            <div>
                <h2>{t('edit.courses')}</h2>
                <hr /> 
            </div>

            <div className='cards-grid'>
                <CardEdit
                    name='New course'
                    onClick={() => setNewCourse(true)}
                    className='card-new'    
                />

                {courses.map((course) => (
                <CardEdit
                    key={course.id}
                    name={course.name}
                    onClick={() => goTo(course.name)}
                    className='card-edit'
                />
                ))}
            </div>
        </section>
        )}

        {newCourse && (
        <section id='section-form'>
            <form id='form' onSubmit={handleSubmit}>
                <Input name='course' label={t('edit.create_course')} />

                <div id='form-btn-container'>
                    <Button className="btn btn-secondary" onClick={closeForm}>
                        {t('form.cancel')}
                    </Button>
                    <Button className="btn btn-primary" type="submit">
                        {t('form.send')}
                    </Button>
                </div>
            </form>
        </section>
        )}
       </>
    );
}

export default Courses