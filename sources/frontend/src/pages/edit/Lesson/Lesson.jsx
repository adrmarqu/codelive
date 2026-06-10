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

const translateAndDetectText = async (text, toLang) =>
{
    if (!text || !toLang) return "";

    try
    {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=|${toLang}`
        );
        const data = await response.json();
        
        return data?.responseData?.translatedText || text;
    } 
    catch (error)
    {
        console.error("Error al detectar y traducir:", error);
        return text;
    }
};

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

    const [isSaving, setIsSaving] = useState(false);

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
                        
                        const r = await getLevelRequest(fetchedModuleId, level, t('lang_sub'));
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
    }, [module, course, level, t]); 

    useEffect(() =>
    {
        const fetchLesson = async () =>
        {
            if (!levelId) return;
            try
            {
                const r = await getLessonRequest(levelId, t('lang_sub'));
                if (r && r.data) {
                    setState("put");
                    setTitle(r.data.title);
                    setContent(r.data.content);
                    setCode(r.data.code);
                }
            }
            catch (error)
            { 
                console.error("Error al cargar contenido:", error); 
            }
        };

        fetchLesson();
    }, [levelId, t]);

    const createLesson = async () =>
    {
        setIsSaving(true);
        try
        {
            const languages = ['es', 'ca', 'en'];

            for (const lang of languages)
            {
                const langTit = await translateAndDetectText(title, lang);
                const langCon = await translateAndDetectText(content, lang);

                await postLessonRequest(levelId, lang, langTit, langCon, code);
            }
            navigate(-1);
        }
        catch (error) { console.error("Error al crear contenido:", error); }
        finally { setIsSaving(false); }
    };

    const updateLesson = async () =>
    {
        setIsSaving(true);
        try
        {
            const languages = ['es', 'ca', 'en'];

            for (const lang of languages)
            {
                const langTit = await translateAndDetectText(title, lang);
                const langCon = await translateAndDetectText(content, lang);

                await putLessonRequest(levelId, lang, langTit, langCon, code);
            }
            navigate(-1);
        }
        catch (error) { console.error("Error al actualizar contenido:", error); }
        finally { setIsSaving(false); }
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