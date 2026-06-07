const { getCourse, getCourses, postCourse, putCourse, deleteCourse } = require('../models/courses.js');

const getAllCourses = async (req, res) =>
{
    try
    {
        const courses = await getCourses();
        return res.status(200).json(courses || []);
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

const getOneCourse = async (req, res) =>
{
    const { courseName } = req.params;

    try
    {
        const course = await getCourse(courseName);
        if (!course) 
            return res.status(409).json({message: "Ese curso no existe"});
        return res.status(200).json(course);
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

const postOneCourse = async (req, res) =>
{
    const { name } = req.body;
    
    try
    {
        const result = await postCourse(name);
        
        if (!result)
            return res.status(400).json({message: "Ese curso ya existe"});

        return res.status(200).json({message: "Curso creado con exito"});
    }
    catch (error)
    {
        console.error("ERROR DETALLADO:", error); 
        return res.status(500).json({message: error});
    }
};

const putOneCourse = async (req, res) =>
{
    const { courseId } = req.params;
    const { name } = req.body;

    try
    {
        const result = await putCourse(courseId, name);
        if (!result)
            return res.status(400).json({message: "El curso no se ha actualizado"});

        return res.status(200).json({message: "Curso actualizado con exito"});
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

const deleteOneCourse = async (req, res) =>
{
    const { courseId } = req.params;
    try
    {
        const result = await deleteCourse(courseId);
        if (!result)
            return res.status(400).json({message: "Error al eliminar el curso"});

        return res.status(200).json({message: "Curso eliminado con exito"});
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

module.exports = { getOneCourse, getAllCourses, postOneCourse, putOneCourse, deleteOneCourse };