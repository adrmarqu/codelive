const { getLevel, getLevelById, getLevels, postLevel, putLevel, deleteLevel, getLessonByLevel, changeLevel } = require('../models/levels.js');

const getAllLevels = async (req, res) =>
{
    const { moduleId } = req.params;
    
    try
    {
        const result = await getLevels(moduleId);
        return res.status(200).json(result || []);
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

const postOneLevel = async (req, res) =>
{
    const { moduleId } = req.params;
    const { levelName, level } = req.body;
    
    try
    {
        const result = await postLevel(moduleId, levelName, level);
        
        if (!result)
            return res.status(400).json({message: "Ese nivel ya existe"});

        return res.status(200).json({message: "Nivel creado con exito"});
    }
    catch (error)
    {
        console.error("ERROR DETALLADO:", error); 
        return res.status(500).json({message: error});
    }
};

const putOneLevel = async (req, res) =>
{
    const { levelId } = req.params;
    const { levelName } = req.body;
    
    try
    {
        const result = await putLevel(levelId, levelName);
        if (!result)
            return res.status(400).json({message: "El nivel no se ha actualizado"});

        return res.status(200).json({message: "Nivel actualizado con exito"});
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

const swapTwoLevels = async (req, res) =>
{
    const { moduleId, levelId } = req.params;
    const { direction } = req.body;
    
    try
    {
        /* Get level A */
        const levelA = await getLevelById(levelId);
        if (!levelA)
            return res.status(400).json({message: "Ese nivel no existe"});

        /* Save levels */
        const currLevel = levelA.level;
        const targetLevel = direction === 'up' ? currLevel - 1 : currLevel + 1;

        /* Get level B */
        const levelB = await getLessonByLevel(moduleId, targetLevel);
        if (!levelB)
            return res.status(400).json({message: "No hay nivel en esa direccion"});

        /* Swap levels */
        const result = await changeLevel(levelA.id, levelB.id, currLevel, targetLevel);
        if (!result)
            return res.status(400).json({message: "No se ha podido mover el nivel"});
        
        return res.status(200).json({message: "Nivel movido con exito"});
    }
    catch (error)
    {
        console.error("ERROR DETALLADO:", error); 
        return res.status(500).json({message: error});
    }
};

const deleteOneLevel = async (req, res) =>
{
    const { levelId } = req.params;
    
    try
    {
        const result = await deleteLevel(levelId);
        if (!result)
            return res.status(400).json({message: "Error al eliminar el nivel"});

        return res.status(200).json({message: "Nivel eliminado con exito"});
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

module.exports = { getAllLevels, postOneLevel, putOneLevel, swapTwoLevels, deleteOneLevel};
