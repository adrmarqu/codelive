import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next'

import Courses from '@/pages/edit/Courses/Courses.jsx'
import Modules from '@/pages/edit/Modules/Modules.jsx'
import Levels from '@/pages/edit/Levels/Levels.jsx'
import Lesson from '@/pages/edit/Lesson/Lesson.jsx'

import Button from '@/components/common/button/Button.jsx'
import Input from '@/components/forms/Input/Input.jsx'
import FormEdit from '@/components/forms/Form/FormEdit.jsx'

import { postCourseResquest, putCourseResquest, deleteCourseRequest } from "@/services/courses.js"
/* import { postModuleResquest, putModuleResquest, deleteModuleRequest } from "@/services/modules.js"
import { postLevelResquest, putLevelResquest, deleteLevelRequest } from "@/services/levels.js" */

import './Create.css'

function Create()
{
    const { courseId, moduleId, lessonId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [isForm, setIsForm] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);

    const openForm = (data = null) =>
    {
        setItemToEdit(data);
        setIsForm(true);
    };

    const handleSave = async (formData) =>
    {
        try
        {
            let response;
            
            if (itemToEdit)
            {
                if (moduleId) response = await putLevelRequest(itemToEdit.id, formData);
                else if (courseId) response = await putModuleRequest(itemToEdit.id, formData);
                else response = await putCourseRequest(itemToEdit.id, formData);
            }
            else
            {
                if (moduleId)
                    response = await postLevelRequest(moduleId, formData);
                else if (courseId)
                    response = await postModuleRequest(courseId, formData);
                else
                    response = await postCourseRequest(formData);
            }

            console.log("Recibido:", response);
            
            setIsForm(false);
            setItemToEdit(null);
            await loadData();
        }
        catch (error)
        {
            console.error("Error al persistir el elemento:", error);
        }
    };

    const renderHeader = () =>
    (
        <div className="edit-header">
            {courseId && <Button onClick={() => navigate(-1)}>{t('return')}</Button>}
            <h2>{t('courses')}</h2> {/* Aquí podrías poner lógica para cambiar el título dinámicamente */}
            {!isForm && <Button onClick={() => openForm()}>{t('new')}</Button>}
        </div>
    );

    const renderContent = () =>
    (
        <div className="edit-content">
            {lessonId ? <Lesson course={courseId} module={moduleId} level={lessonId} onEdit={openForm} />
            : moduleId ? <Levels course={courseId} module={moduleId} onEdit={openForm} />
            : courseId ? <Modules course={courseId} onEdit={openForm} />
            : <Courses onEdit={openForm} />}
        </div>
    );

    return (
        <section id="edit-section">
            {!isForm ? (
                <>
                    {renderHeader()}
                    {renderContent()}
                </>
            ) : (
                <FormEdit 
                    initialData={itemToEdit} 
                    onClose={() => setIsForm(false)} 
                    onSubmit={handleSave} 
                />
            )}
        </section>
    );
}

export default Create