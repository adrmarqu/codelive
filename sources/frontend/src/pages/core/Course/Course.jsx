import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCoursesLearn } from '@/services/learn.js'
import Button from '@/components/common/Button/Button.jsx'
import '../dashboard.css'

function Course() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCoursesLearn();
                if (response && response.data) {
                    setCourses(response.data);
                }
            } catch (err) {
                console.error("Error al cargar cursos:", err);
                setError(t('error_loading_courses') || "Error al cargar los cursos");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [t]);

    const getCourseColor = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('html')) return 'html-theme';
        if (lowerName.includes('css')) return 'css-theme';
        if (lowerName.includes('javascript') || lowerName.includes('js')) return 'js-theme';
        if (lowerName.includes('php')) return 'php-theme';
        if (lowerName.includes('node')) return 'node-theme';
        if (lowerName.includes('sql')) return 'sql-theme';
        return 'default-theme';
    };

    if (loading) {
        return (
            <div className="learn-loading">
                <div className="spinner"></div>
                <p>{t('loading') || "Cargando..."}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="learn-error-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="courses-dashboard">
            <header className="dashboard-header">
                <h1>{t('courses_dashboard_title') || "Aprende con CodeLive"}</h1>
                <p>{t('courses_dashboard_subtitle') || "Elige un lenguaje y comienza tu aventura de programación de forma interactiva."}</p>
            </header>

            <div className="courses-grid">
                {courses.length === 0 ? (
                    <div className="no-courses">
                        <p>{t('no_courses_available') || "No hay cursos disponibles en este momento."}</p>
                    </div>
                ) : (
                    courses.map((course) => {
                        const themeClass = getCourseColor(course.name);
                        return (
                            <div key={course.id} className={`course-card ${themeClass}`}>
                                <div className="course-card-content">
                                    <div className="course-icon-container">
                                        <span className="course-badge">{course.name.toUpperCase()}</span>
                                    </div>
                                    <h3>Curso de {course.name}</h3>
                                    <p>{t('course_card_desc', { name: course.name }) || `Domina ${course.name} paso a paso con lecciones teóricas y ejercicios prácticos interactivos en tiempo real.`}</p>
                                    <Button 
                                        className="btn btn-primary start-course-btn"
                                        onClick={() => navigate(`/learn/courses/${course.name}`)}
                                    >
                                        {t('start_learning') || "Comenzar a aprender"}
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

export default Course;
