import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCourseLearn, getModulesLearn } from '@/services/learn.js'
import Button from '@/components/common/Button/Button.jsx'
import '../dashboard.css'

function Modules() {
    const { t } = useTranslation();
    const { course } = useParams();
    const navigate = useNavigate();

    const [courseDetails, setCourseDetails] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourseAndModules = async () => {
            try {
                // 1. Obtener detalles del curso
                const courseResponse = await getCourseLearn(course);
                if (courseResponse && courseResponse.data) {
                    const courseData = courseResponse.data;
                    setCourseDetails(courseData);

                    // 2. Obtener módulos de este curso
                    const modulesResponse = await getModulesLearn(courseData.id);
                    if (modulesResponse && modulesResponse.data) {
                        setModules(modulesResponse.data);
                    }
                }
            } catch (err) {
                console.error("Error al cargar temario:", err);
                setError(t('error_loading_modules') || "Error al cargar el temario del curso");
            } finally {
                setLoading(false);
            }
        };
        if (course) fetchCourseAndModules();
    }, [course, t]);

    if (loading) {
        return (
            <div className="learn-loading">
                <div className="spinner"></div>
                <p>{t('loading') || "Cargando temario..."}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="learn-error-container">
                <p className="error-message">{error}</p>
                <Button className="btn btn-secondary" onClick={() => navigate('/learn/courses')}>
                    {t('back_to_courses') || "Volver a Cursos"}
                </Button>
            </div>
        );
    }

    return (
        <div className="modules-view">
            <header className="modules-header">
                <Button className="btn btn-secondary back-btn" onClick={() => navigate('/learn/courses')}>
                    &larr; {t('back') || "Atrás"}
                </Button>
                <h1>Curso de {courseDetails?.name}</h1>
                <p>{t('modules_subtitle') || "Explora las unidades didácticas y los temas disponibles para este lenguaje."}</p>
            </header>

            <div className="modules-list">
                {modules.length === 0 ? (
                    <div className="no-modules">
                        <p>{t('no_modules_available') || "Aún no hay módulos disponibles para este curso."}</p>
                    </div>
                ) : (
                    modules.map((mod, index) => (
                        <div key={mod.id} className="module-item-card" onClick={() => navigate(`/learn/courses/${course}/${mod.name}`)}>
                            <div className="module-info">
                                <span className="module-index">{t('module') || "Módulo"} {index + 1}</span>
                                <h2>{mod.name}</h2>
                                <p>{t('click_to_view_levels') || "Haz clic para ver los temas y lecciones de esta unidad."}</p>
                            </div>
                            <div className="module-action">
                                <span className="arrow-icon">&rarr;</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Modules;
