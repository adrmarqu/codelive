import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

import Input from '@/components/Forms/Input/Input.jsx'
import Button from '@/components/Common/Button/Button.jsx'

import {
    getCourseRequest,
    getModuleRequest,
    getLessonRequest,
    postLessonRequest, 
    putLessonRequest 
} from '@/services/edit.js'

function Lesson({course, module, level})
{
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { course, module, level } = useParams();

    const [state, setState] = useState("post");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [code, setCode] = useState("");

    const [courseId, setCourseId] = useState("");
    const [moduleId, setModuleId] = useState("");
    const [levelId, setLevelId] = useState("");
    const [lessonId, setLessonId] = useState();

    useEffect(() =>
        {
            const init = async () =>
            {
                try
                {
                    const res = await getCourseRequest(course);
                    if (res && res.data)
                    {
                        setCourseId(res.data.id);
    
                        const response = await getModuleRequest(courseId, module);
                        if (response && response.data)
                        {
                            setModuleId(response.data.id);
                            
                            const r = await getLevelRequest(moduleId, level);
                            if (r && r.data) setLevelId(r.data.id);
                        }
                    }
                } 
                catch (error) { console.error("Error al obtener el módulo:", error); }
            };
            init();
        }, [module, course]);

    const fecthLesson = async () =>
    {
        try
        {
            /* Devuleve las lessons de todos los idiomas */
            const r = await getLessonRequest(levelId);

            if (r && r.data)
            {
                setState("put");
                setLessonId(r.data.id);
                setTitle(r.data.title);
                setContent(r.data.content);
                setCode(r.data.code);
            }
        }
        catch (error) { console.error("Error al cargar contenido:", error); }
    };

    const createLesson = async () =>
    {
        try
        {
            await postLessonRequest(levelId, t('lang_sub'), title, content, code);
        }
        catch (error) { console.error("Error al crear contenido:", error); }
    };

    const updateLesson = async () =>
    {
        try
        {
            await putLessonRequest(levelId, t('lang_sub'), title, content, code);
        }
        catch (error) { console.error("Error al actualizar contenido:", error); }
    };

    const handleSave = () =>
    {
        if (state === 'post') createLesson();
        else if (state === 'put') updateLesson();
    };

    return (
        <>
        <div className='edit-header'>
            <Button className="btn btn-secondary" onClick={() => navigate(-1)} >
                {t('return')}
            </Button>
            <h2>{t('level')}{level}</h2>
            <div></div>
        </div>
        <hr />
        <div className='edit-lesson'>
            <Input />
            <textarea name="" id=""></textarea>
            <textarea name="" id=""></textarea>

            <div className='lesson-btn'>
                <Button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    {t('cancel')}
                </Button>
                <Button className="btn btn-primary" onClick={handleSave}>
                    {t('save')}
                </Button>
            </div>
        </div>
        </>
    );
}

export default Lesson