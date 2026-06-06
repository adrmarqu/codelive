const { getCourses, postCourse, putCourse, deleteCourse } = require('../models/courses.js');

const getAllCourses = async (req, res) =>
{
    try
    {
        const courses = await getCourses();
        return res.status(200).json(courses);
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
        return res.status(500).json({message: "Internal error"});
    }
};

const putOneCourse = async (req, res) =>
{
    const { courseId } = req.params;
    const { name } = req.body;

    try
    {
        const result = await putCourse(id, name);
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
        const result = await deleteCourse(id);
        if (!result)
            return res.status(400).json({message: "Error al eliminar el curso"});

        return res.status(200).json({message: "Curso eliminado con exito"});
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

module.exports = { getAllCourses, postOneCourse, putOneCourse, deleteOneCourse };