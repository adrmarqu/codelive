const { getCourses, getCourse, postCourse } = require('../models/courses.js');

const getAllCourses = async (req, res) =>
{
    try
    {
        const courses = await getCourses();
        return res.status(200).json(courses.rows);
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

const getOneCourse = async (req, res) =>
{
    const { course } = req.params;

    try
    {
        const course = await getCourse(course);

        if (!course)
            return res.status(404).json({ message: "No se encontro el curso" });

        return res.status(200).json(course);
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

const postOneCourse = async (req, res) =>
{
    const { creator, courseName } = req.params;
    try
    {
        if (!await postCourse(courseName, creator))
            return res.status(400).json({message: "Ese curso ya existe"});

        return res.status(200).json({message: "Curso creado con exito"});
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

module.exports = { getAllCourses, getOneCourse, postOneCourse };