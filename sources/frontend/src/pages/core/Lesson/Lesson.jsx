import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
    getCourseLearn, 
    getModuleLearn, 
    getLevelsLearn, 
    getLessonLearn, 
    getProgressLearn, 
    saveProgressLearn 
} from '@/services/learn.js'
import Button from '@/components/common/Button/Button.jsx'
import '../dashboard.css'

function Lesson() {
    const { t } = useTranslation();
    const { course, module, level } = useParams();
    const navigate = useNavigate();

    // Estructura y navegación
    const [levels, setLevels] = useState([]);
    const [currentLevelId, setCurrentLevelId] = useState(null);
    const [progress, setProgress] = useState([]);

    // Contenido de la lección
    const [lessonData, setLessonData] = useState(null);
    const [editableCode, setEditableCode] = useState("");
    const [previewSrcDoc, setPreviewSrcDoc] = useState("");

    // Estados de UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPlayground, setShowPlayground] = useState(false);

    // Cargar estructura general del curso
    useEffect(() => {
        const fetchSyllabus = async () => {
            try {
                const courseResponse = await getCourseLearn(course);
                if (courseResponse && courseResponse.data) {
                    const courseId = courseResponse.data.id;

                    const moduleResponse = await getModuleLearn(courseId, module);
                    if (moduleResponse && moduleResponse.data) {
                        const modData = moduleResponse.data;

                        const levelsResponse = await getLevelsLearn(modData.id);
                        if (levelsResponse && levelsResponse.data) {
                            const sorted = levelsResponse.data.sort((a, b) => a.level - b.level);
                            setLevels(sorted);

                            // Encontrar ID del nivel actual basado en el número de nivel
                            const currentLvl = sorted.find(l => l.level === parseInt(level));
                            if (currentLvl) {
                                setCurrentLevelId(currentLvl.id);
                            } else {
                                setError(t('level_not_found') || "Nivel no encontrado");
                            }
                        }
                    }
                }

                // Cargar progreso del usuario
                const progressResponse = await getProgressLearn();
                if (progressResponse && progressResponse.data) {
                    setProgress(progressResponse.data);
                }
            } catch (err) {
                console.error("Error al cargar temario de lección:", err);
                setError(t('error_loading_syllabus') || "Error al cargar la unidad didáctica");
            }
        };

        if (course && module && level) {
            fetchSyllabus();
        }
    }, [course, module, level, t]);

    // Cargar contenido detallado cuando cambia el ID del nivel actual
    useEffect(() => {
        const fetchLessonContent = async () => {
            if (!currentLevelId) return;
            setLoading(true);
            try {
                const response = await getLessonLearn(currentLevelId);
                if (response && response.data) {
                    setLessonData(response.data);
                    setEditableCode(response.data.code || "");
                    setPreviewSrcDoc(response.data.code || "");
                } else {
                    setLessonData(null);
                }
            } catch (err) {
                console.error("Error al obtener contenido de lección:", err);
                // Si da 404 es que no tiene contenido creado aún
                setLessonData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchLessonContent();
    }, [currentLevelId]);

    // Ejecutar código en el iframe
    const handleRunCode = () => {
        setPreviewSrcDoc(editableCode);
    };

    // Marcar lección como completada
    const handleComplete = async () => {
        if (!currentLevelId) return;
        try {
            await saveProgressLearn(currentLevelId);
            setProgress(prev => [...prev, currentLevelId]);
        } catch (error) {
            console.error("Error al guardar progreso:", error);
        }
    };

    // Navegar a otra lección
    const navigateToLevel = (lvlNum) => {
        setShowPlayground(false);
        navigate(`/learn/courses/${course}/${module}/${lvlNum}`);
    };

    const currentIdx = levels.findIndex(l => l.level === parseInt(level));
    const prevLevel = currentIdx > 0 ? levels[currentIdx - 1] : null;
    const nextLevel = currentIdx < levels.length - 1 ? levels[currentIdx + 1] : null;

    if (error) {
        return (
            <div className="learn-error-container">
                <p className="error-message">{error}</p>
                <Button className="btn btn-secondary" onClick={() => navigate(`/learn/courses/${course}/${module}`)}>
                    {t('back') || "Volver"}
                </Button>
            </div>
        );
    }

    return (
        <div className="lesson-page-layout">
            {/* Barra lateral de lecciones (Temario) */}
            <aside className="lesson-sidebar">
                <div className="sidebar-header">
                    <Button className="btn btn-secondary sidebar-back-btn" onClick={() => navigate(`/learn/courses/${course}/${module}`)}>
                        &larr; {t('unit') || "Unidad"}
                    </Button>
                    <h3>Lecciones</h3>
                </div>
                <nav className="sidebar-nav">
                    {levels.map((lvl) => {
                        const active = lvl.level === parseInt(level);
                        const completed = progress.includes(lvl.id);
                        return (
                            <button
                                key={lvl.id}
                                className={`sidebar-nav-item ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}
                                onClick={() => navigateToLevel(lvl.level)}
                            >
                                <span className="item-status">{completed ? "✓" : "○"}</span>
                                <span className="item-title">{t('level') || "Nivel"} {lvl.level} {lvl.type === 'game' ? "🎮" : "📖"}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Contenido Principal */}
            <main className="lesson-main-content">
                {loading ? (
                    <div className="learn-loading">
                        <div className="spinner"></div>
                        <p>{t('loading') || "Cargando lección..."}</p>
                    </div>
                ) : !lessonData ? (
                    <div className="no-lesson-content">
                        <h2>{t('no_content_title') || "Contenido en desarrollo"}</h2>
                        <p>{t('no_content_desc') || "Esta lección aún no tiene teoría ni ejercicios creados por el editor."}</p>
                        <div className="navigation-footer">
                            <Button 
                                className="btn btn-secondary" 
                                disabled={!prevLevel} 
                                onClick={() => navigateToLevel(prevLevel.level)}
                            >
                                &larr; {t('previous') || "Anterior"}
                            </Button>
                            <Button 
                                className="btn btn-secondary" 
                                disabled={!nextLevel} 
                                onClick={() => navigateToLevel(nextLevel.level)}
                            >
                                {t('next') || "Siguiente"} &rarr;
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="lesson-article">
                        <header className="lesson-article-header">
                            <h1>{lessonData.title}</h1>
                            <div className="lesson-badge-row">
                                <span className={`lesson-type-badge ${levels[currentIdx]?.type}`}>
                                    {levels[currentIdx]?.type === 'game' ? "PRÁCTICO (JUEGO)" : "TEÓRICO"}
                                </span>
                                {progress.includes(currentLevelId) && (
                                    <span className="lesson-completed-badge">✓ COMPLETADO</span>
                                )}
                            </div>
                        </header>
                        <hr />

                        <div className="lesson-text-body">
                            {lessonData.content.split('\n').map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>

                        {/* Bloque de código práctico interactivo (Inspirado en W3Schools) */}
                        {lessonData.code && (
                            <div className="interactive-code-box">
                                <div className="code-box-header">
                                    <span>{t('code_example') || "Ejemplo de Código"}</span>
                                    <Button 
                                        className="btn btn-warning try-btn"
                                        onClick={() => setShowPlayground(!showPlayground)}
                                    >
                                        {showPlayground ? (t('hide_playground') || "Ocultar editor") : (t('try_it_yourself') || "Probar código (Try it Yourself)")}
                                    </Button>
                                </div>
                                <pre className="code-box-preview">
                                    <code>{lessonData.code}</code>
                                </pre>

                                {showPlayground && (
                                    <div className="live-playground">
                                        <div className="playground-pane editor-pane">
                                            <div className="pane-header">
                                                <span>{t('editor') || "Editor de código"}</span>
                                                <Button className="btn btn-primary run-btn" onClick={handleRunCode}>
                                                    {t('run') || "Ejecutar (Run)"}
                                                </Button>
                                            </div>
                                            <textarea 
                                                className="playground-textarea"
                                                value={editableCode}
                                                onChange={(e) => setEditableCode(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="playground-pane preview-pane">
                                            <div className="pane-header">
                                                <span>{t('result') || "Vista previa"}</span>
                                            </div>
                                            <iframe
                                                title="CodeLive Live Preview"
                                                className="playground-iframe"
                                                srcDoc={previewSrcDoc}
                                                sandbox="allow-scripts"
                                            ></iframe>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Footer de Navegación y Progreso */}
                        <footer className="navigation-footer">
                            <Button 
                                className="btn btn-secondary" 
                                disabled={!prevLevel} 
                                onClick={() => navigateToLevel(prevLevel.level)}
                            >
                                &larr; {t('previous') || "Anterior"}
                            </Button>

                            {!progress.includes(currentLevelId) && (
                                <Button className="btn btn-success complete-btn" onClick={handleComplete}>
                                    ✓ {t('mark_as_completed') || "Marcar como completado"}
                                </Button>
                            )}

                            <Button 
                                className="btn btn-secondary" 
                                disabled={!nextLevel} 
                                onClick={() => navigateToLevel(nextLevel.level)}
                            >
                                {t('next') || "Siguiente"} &rarr;
                            </Button>
                        </footer>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Lesson;
