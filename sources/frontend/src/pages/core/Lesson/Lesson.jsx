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
import api from '@/services/api.js'
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

    // Estados del Code Runner
    const [runnerOutput, setRunnerOutput] = useState("");
    const [sqlResult, setSqlResult] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

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

                // Cargar progreso del usuario si está logueado
                if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
                    try {
                        const progressResponse = await getProgressLearn();
                        if (progressResponse && progressResponse.data) {
                            setProgress(progressResponse.data);
                        }
                    } catch (progressErr) {
                        console.error("Error al cargar progreso de lección:", progressErr);
                    }
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

    // Ejecutar código en el iframe (HTML/CSS/JS) o en el backend (PHP/Node/SQL)
    const handleRunCode = async () => {
        const lang = lessonData?.code_lang || 'html';
        
        if (lang === 'html') {
            setPreviewSrcDoc(editableCode);
        } else if (lang === 'css') {
            const html = `
                <html>
                    <head>
                        <style>
                            ${editableCode}
                        </style>
                    </head>
                    <body style="font-family: sans-serif; padding: 20px; color: #333; background: #fff;">
                        <h1>Título de Prueba (h1)</h1>
                        <p>Este es un párrafo de ejemplo (p) para que puedas probar tus estilos CSS.</p>
                        <button style="padding: 8px 16px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: #f0f0f0;">Botón de ejemplo</button>
                        <div class="box" style="margin-top: 15px; padding: 20px; border: 1px dashed #ccc; text-align: center;">
                            Caja de ejemplo (clase: .box)
                        </div>
                    </body>
                </html>
            `;
            setPreviewSrcDoc(html);
        } else if (lang === 'js') {
            const wrappedCode = `
                <html>
                    <body style="margin: 0; padding: 0;">
                        <div id="console-output" style="font-family: 'Courier New', Courier, monospace; font-size: 14px; white-space: pre-wrap; padding: 15px; color: #e0e0e0; background: #1e1e1e; min-height: 100vh; box-sizing: border-box; overflow-y: auto;"></div>
                        <script>
                            (function() {
                                const output = document.getElementById('console-output');
                                const originalLog = console.log;
                                const originalError = console.error;
                                
                                console.log = function(...args) {
                                    originalLog.apply(console, args);
                                    const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
                                    output.textContent += msg + '\\n';
                                };
                                
                                console.error = function(...args) {
                                    originalError.apply(console, args);
                                    const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
                                    output.innerHTML += '<span style="color: #ff6b6b; font-weight: bold;">Error: ' + msg + '</span>\\n';
                                };
                                
                                window.onerror = function(message, source, lineno, colno, error) {
                                    output.innerHTML += '<span style="color: #ff6b6b; font-weight: bold;">Error: ' + message + '</span>\\n';
                                };
                                
                                try {
                                    ${editableCode}
                                } catch(err) {
                                    output.innerHTML += '<span style="color: #ff6b6b; font-weight: bold;">Error: ' + err.message + '</span>\\n';
                                }
                            })();
                        </script>
                    </body>
                </html>
            `;
            setPreviewSrcDoc(wrappedCode);
        } else {
            setIsRunning(true);
            setRunnerOutput("Ejecutando código...");
            setSqlResult(null);
            try {
                const response = await api.post('/api/learn/run', {
                    code: editableCode,
                    lang: lang
                });
                if (lang === 'sql' && response.data.type === 'table') {
                    setSqlResult({
                        columns: response.data.columns,
                        rows: response.data.rows
                    });
                    setRunnerOutput("");
                } else {
                    setRunnerOutput(response.data.output || response.data.message || "Ejecución completada sin salida.");
                }
            } catch (err) {
                console.error("Error al ejecutar código:", err);
                setRunnerOutput(err.response?.data?.error || "Error al ejecutar el código en el servidor.");
            } finally {
                setIsRunning(false);
            }
        }
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
                                            {!lessonData.code_lang || ['html', 'css', 'js'].includes(lessonData.code_lang) ? (
                                                <iframe
                                                    title="CodeLive Live Preview"
                                                    className="playground-iframe"
                                                    srcDoc={previewSrcDoc}
                                                    sandbox="allow-scripts"
                                                ></iframe>
                                            ) : (
                                                <div className="terminal-preview" style={{
                                                    fontFamily: "'Courier New', Courier, monospace",
                                                    fontSize: '14px',
                                                    padding: '15px',
                                                    color: '#e0e0e0',
                                                    background: '#1e1e1e',
                                                    height: 'calc(100% - 40px)',
                                                    boxSizing: 'border-box',
                                                    overflow: 'auto',
                                                    whiteSpace: 'pre-wrap'
                                                }}>
                                                    {isRunning ? (
                                                        <div className="loading-output">Ejecutando...</div>
                                                    ) : sqlResult ? (
                                                        <div className="sql-table-wrapper" style={{ overflowX: 'auto' }}>
                                                            {sqlResult.rows.length === 0 ? (
                                                                <div>Consulta ejecutada con éxito. 0 filas devueltas.</div>
                                                            ) : (
                                                                <table style={{
                                                                    width: '100%',
                                                                    borderCollapse: 'collapse',
                                                                    marginTop: '10px',
                                                                    border: '1px solid #444'
                                                                }}>
                                                                    <thead>
                                                                        <tr style={{ background: '#333' }}>
                                                                            {sqlResult.columns.map((col, idx) => (
                                                                                <th key={idx} style={{
                                                                                    padding: '8px',
                                                                                    border: '1px solid #444',
                                                                                    textAlign: 'left'
                                                                                }}>{col}</th>
                                                                            ))}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {sqlResult.rows.map((row, rIdx) => (
                                                                            <tr key={rIdx} style={{
                                                                                background: rIdx % 2 === 0 ? '#1e1e1e' : '#252525'
                                                                            }}>
                                                                                {sqlResult.columns.map((col, cIdx) => (
                                                                                    <td key={cIdx} style={{
                                                                                        padding: '8px',
                                                                                        border: '1px solid #444'
                                                                                    }}>
                                                                                        {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? 'NULL')}
                                                                                    </td>
                                                                                ))}
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div>{runnerOutput || "Haz clic en 'Ejecutar' para ver la salida aquí."}</div>
                                                    )}
                                                </div>
                                            )}
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
