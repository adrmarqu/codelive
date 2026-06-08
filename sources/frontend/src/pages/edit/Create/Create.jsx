import { useParams } from "react-router-dom"

import Courses from '@/pages/edit/Courses/Courses.jsx'
import Modules from '@/pages/edit/Modules/Modules.jsx'
import Levels from '@/pages/edit/Levels/Levels.jsx'
import Lesson from '@/pages/edit/Lesson/Lesson.jsx'

import './Create.css'

/* 

/edit/courses
/edit/courses/:course
/edit/courses/:course/:module
/edit/courses/:course/:module/:level

*/

function Create()
{
    const { course, module, level } = useParams();

    const getRenderContent = () =>
    {
        if (level) return <Lesson />;
        if (module) return <Levels />;
        if (course) return <Modules />;
        return <Courses />;
    };

    return (
        <section id="edit-section">
            {getRenderContent()}
        </section>
    );
}

export default Create