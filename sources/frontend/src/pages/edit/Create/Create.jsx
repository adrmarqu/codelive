import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next'

import Courses from '@/pages/edit/Courses/Courses.jsx'
import Modules from '@/pages/edit/Modules/Modules.jsx'
import Levels from '@/pages/edit/Levels/Levels.jsx'
import Lesson from '@/pages/edit/Lesson/Lesson.jsx'

import Button from '@/components/Common/button/Button.jsx'
import Input from '@/components/Forms/Input/Input.jsx'

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
    const { t } = useTranslation();
    const navigate = useNavigate();

    const getRenderContent = () =>
    {
        if (level) return <Lesson course={course} module={module} level={level} />;
        if (module) return <Levels course={course} module={module} />;
        if (course) return <Modules course={course} />;
        return <Courses />;
    };

    return (
        <section id="edit-section">
            {getRenderContent()}
        </section>
    );
}

export default Create