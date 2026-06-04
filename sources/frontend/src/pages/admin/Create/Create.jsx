import { useParams } from "react-router-dom";

import Courses from '../Courses/Courses.jsx'
import Modules from '../Modules/Modules.jsx'
import Levels from '../Levels/Levels.jsx'
import Lesson from '../Lesson/Lesson.jsx'

function Create()
{
    const { courseId, moduleId, lessonId} = useParams();

    if (lessonId)
        return (<Lesson lessonId={lessonId}/>);
    if (moduleId)
        return (<Levels moduleId={moduleId}/>);
    if (courseId)
        return (<Modules courseId={courseId}/>);
    return (<Courses />);
}

export default Create