import { useParams } from "react-router-dom"

import Course from '@/pages/core/Course/Course.jsx'
import Modules from '@/pages/core/Modules/Modules.jsx'
import Levels from '@/pages/core/Levels/Levels.jsx'
import Lesson from '@/pages/core/Lesson/Lesson.jsx'

import './dashboard.css'

function Learn()
{
    const { course, module, level } = useParams();

    const getRenderContent = () =>
    {
        if (level) return <Lesson />;
        if (module) return <Levels />;
        if (course) return <Modules />;
        return <Course />;
    };

    return (
        <section id="learn-section">
            {getRenderContent()}
        </section>
    );
}

export default Learn;
