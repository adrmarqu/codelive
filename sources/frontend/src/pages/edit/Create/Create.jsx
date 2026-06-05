import { useParams } from "react-router-dom"

import Courses from '@/pages/edit/Courses/Courses.jsx'
import Modules from '@/pages/edit/Modules/Modules.jsx'
import Levels from '@/pages/edit/Levels/Levels.jsx'
import Lesson from '@/pages/edit/Lesson/Lesson.jsx'

import './Create.css'

function Create()
{
    const { courseId, moduleId, lessonId} = useParams();

    if (lessonId)
        return (<Lesson courseId={courseId} moduleId={moduleId} lessonId={lessonId}/>);
    if (moduleId)
        return (<Levels courseId={courseId} moduleId={moduleId}/>);
    if (courseId)
        return (<Modules courseId={courseId}/>);
    return (<Courses />);
}

export default Create