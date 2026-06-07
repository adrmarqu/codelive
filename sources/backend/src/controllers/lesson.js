const {
    getLesson,
    postLesson,
    putLesson
} = require('../models/lessons.js');

const getOneLesson = async (req, res) =>
{
    const { levelId } = req.params;
    
    try
    {
        const result = await getLesson(levelId);
        if (!result)
            return res.status(400).json({message: "Error al recoger el contenido"});

        return res.status(200).json(result);
    }
    catch (error)
    {
        return res.status(500).json({message: error});
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

        return true;
    }
    catch (error)
    {
        return res.status(500).json({message: error});
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

        return true;
    }
    catch (error)
    {
        return res.status(500).json({message: error});
    }
};

module.exports = { getOneLesson, postOneLesson, putOneLesson };