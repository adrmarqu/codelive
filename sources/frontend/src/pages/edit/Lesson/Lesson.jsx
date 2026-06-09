import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react' // 🔥 CORREGIDO: Importado useEffect

import Button from '@/components/common/Button/Button.jsx'

import {
    getCourseRequest,
    getModuleRequest,
    getLevelRequest,
    getLessonRequest,
    postLessonRequest, 
    putLessonRequest 
} from '@/services/edit.js'

import './Lesson.css'

function Lesson()
{
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { course, module, level } = useParams();

    const [state, setState] = useState("post");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [code, setCode] = useState("");

    const [levelId, setLevelId] = useState("");

    // Traer IDs iniciales del curso, módulo y nivel
    useEffect(() => {
        const init = async () => {
            try {
                const res = await getCourseRequest(course);
                if (res && res.data) {
                    const fetchedCourseId = res.data.id;

                    const response = await getModuleRequest(fetchedCourseId, module);
                    if (response && response.data) {
                        const fetchedModuleId = response.data.id;
                        
                        const r = await getLevelRequest(fetchedModuleId, level);
                        if (r && r.data) {
                            setLevelId(r.data.id);
                        }
                    }
                }
            } 
            catch (error) { 
                console.error("Error al obtener los datos iniciales:", error); 
            }
        };
        init();
    }, [module, course, level]); 

    // 🔥 CORRECCIÓN: Nuevo useEffect para disparar fetchLesson automáticamente cuando levelId cambie
    useEffect(() => {
        const fetchLesson = async () => {
            if (!levelId) return;
            try {
                const r = await getLessonRequest(levelId);
                if (r && r.data) {
                    setState("put");
                    setTitle(r.data.title);
                    setContent(r.data.content);
                    setCode(r.data.code);
                }
            }
            catch (error) { 
                console.error("Error al cargar contenido:", error); 
            }
        };

        fetchLesson();
    }, [levelId]); // Se ejecuta cada vez que levelId tenga un valor válido

    const createLesson = async () => {
        try {
            await postLessonRequest(levelId, t('lang_sub'), title, content, code);
        }
        catch (error) { console.error("Error al crear contenido:", error); }
    };

    const updateLesson = async () => {
        try {
            await putLessonRequest(levelId, t('lang_sub'), title, content, code);
        }
        catch (error) { console.error("Error al actualizar contenido:", error); }
    };

    const handleSave = () => {
        if (state === 'post') createLesson();
        else if (state === 'put') updateLesson();
    };

    return (
        <>
        <div className='edit-header'>
            <Button className="btn btn-secondary" onClick={() => navigate(-1)} >
                {t('return')}
            </Button>
            <h2>{t('level')} {level}</h2>
            <div></div>
        </div>
        <hr />
        <div className='edit-lesson'>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('title')}/>
            <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder={t('content')}
            ></textarea>
            <textarea 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                placeholder={t('code')}
            ></textarea>

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

export default Lesson;