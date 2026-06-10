const {
    getLesson,
    postLesson,
    putLesson
} = require('../models/lessons.js');

const getOneLesson = async (req, res) =>
{
    const { lang, levelId } = req.params;
    
    try
    {
        const result = await getLesson(levelId, lang);
        if (!result)
        {
            return res.status(200).json({
                id: null,
                title: "",
                content: "",
                code: ""
            });
        }

        return res.status(200).json(result);
    }
    catch (error)
    {
        console.error("Error in getOneLesson:", error);
        return res.status(500).json({message: "Error interno del servidor"});
    }
};

const postOneLesson = async (req, res) =>
{
    const { levelId } = req.params;
    const { lang, title, content, code } = req.body;
    
    try
    {
        const result = await postLesson(levelId, lang, title, content, code);
        if (!result)
            return res.status(400).json({message: "Error al subir contenido"});

        return res.status(201).json({message: "Contenido creado con éxito"});
    }
    catch (error)
    {
        console.error("Error in postOneLesson:", error);
        return res.status(500).json({message: "Error interno del servidor"});
    }
};

const putOneLesson = async (req, res) =>
{
    const { levelId } = req.params;
    const { lang, title, content, code } = req.body;
    
    try
    {
        const result = await putLesson(levelId, lang, title, content, code);
        
        if (!result)
            return res.status(400).json({message: "Error al actualizar contenido"});

        return res.status(200).json({message: "Contenido actualizado con éxito"});
    }
    catch (error)
    {
        console.error("Error in putOneLesson:", error);
        return res.status(500).json({message: "Error interno del servidor"});
    }
};

module.exports = { getOneLesson, postOneLesson, putOneLesson };