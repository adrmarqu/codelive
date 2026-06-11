import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCourseLearn, getModuleLearn, getLevelsLearn, getProgressLearn } from '@/services/learn.js'
import Button from '@/components/common/Button/Button.jsx'
import '../dashboard.css'

function Levels() {
    const { t } = useTranslation();
    const { course, module } = useParams();
    const navigate = useNavigate();

    const [moduleDetails, setModuleDetails] = useState(null);
    const [levels, setLevels] = useState([]);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLevelsAndProgress = async () => {
            try {
                // 1. Obtener detalles del curso
                const courseResponse = await getCourseLearn(course);
                if (courseResponse && courseResponse.data) {
                    const courseId = courseResponse.data.id;

                    // 2. Obtener detalles del módulo
                    const moduleResponse = await getModuleLearn(courseId, module);
                    if (moduleResponse && moduleResponse.data) {
                        const modData = moduleResponse.data;
                        setModuleDetails(modData);

                        // 3. Obtener niveles de este módulo
                        const levelsResponse = await getLevelsLearn(modData.id);
                        if (levelsResponse && levelsResponse.data) {
                            // Ordenar niveles de menor a mayor
                            const sortedLevels = levelsResponse.data.sort((a, b) => a.level - b.level);
                            setLevels(sortedLevels);
                        }
                    }
                }

                // 4. Obtener progreso del usuario (IDs de lecciones completadas) si está logueado
                if (localStorage.getItem('token')) {
                    try {
                        const progressResponse = await getProgressLearn();
                        if (progressResponse && progressResponse.data) {
                            setProgress(progressResponse.data);
                        }
                    } catch (progressErr) {
                        console.error("Error al cargar progreso del usuario:", progressErr);
                    }
                }
            } catch (err) {
                console.error("Error al cargar temas:", err);
                setError(t('error_loading_levels') || "Error al cargar los temas del módulo");
            } finally {
                setLoading(false);
            }
        };

        if (course && module) fetchLevelsAndProgress();
    }, [course, module, t]);

    if (loading) {
        return (
            <div className="learn-loading">
                <div className="spinner"></div>
                <p>{t('loading') || "Cargando temas..."}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="learn-error-container">
                <p className="error-message">{error}</p>
                <Button className="btn btn-secondary" onClick={() => navigate(`/learn/courses/${course}`)}>
                    {t('back_to_syllabus') || "Volver al Temario"}
                </Button>
            </div>
        );
    }

    const isCompleted = (levelId) => {
        return progress.includes(levelId);
    };

    return (
        <div className="levels-view">
            <header className="levels-header">
                <Button className="btn btn-secondary back-btn" onClick={() => navigate(`/learn/courses/${course}`)}>
                    &larr; {t('back') || "Atrás"}
                </Button>
                <h1>{moduleDetails?.name}</h1>
                <p>{t('levels_subtitle') || "Completa los siguientes niveles para dominar esta unidad."}</p>
            </header>

            <div className="levels-list">
                {levels.length === 0 ? (
                    <div className="no-levels">
                        <p>{t('no_levels_available') || "Aún no hay niveles creados para esta unidad."}</p>
                    </div>
                ) : (
                    levels.map((lvl) => {
                        const completed = isCompleted(lvl.id);
                        return (
                            <div 
                                key={lvl.id} 
                                className={`level-item-row ${completed ? 'completed' : ''}`}
                                onClick={() => navigate(`/learn/courses/${course}/${module}/${lvl.level}`)}
                            >
                                <div className="level-status-indicator">
                                    {completed ? (
                                        <span className="checkmark-icon">✓</span>
                                    ) : (
                                        <span className="pending-icon">&#9675;</span>
                                    )}
                                </div>
                                <div className="level-details">
                                    <span className="level-tag">{t('level') || "Nivel"} {lvl.level}</span>
                                    <h3>{lvl.type === 'game' ? `🎮 Juego Práctico` : `📖 Lección Teórica`}</h3>
                                </div>
                                <div className="level-action">
                                    <Button className={`btn ${completed ? 'btn-secondary' : 'btn-primary'}`}>
                                        {completed ? (t('review') || "Repasar") : (t('start') || "Comenzar")}
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Levels;
