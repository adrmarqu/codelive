const {
    getLevel,
    getLevelById, 
    getLevels, 
    postLevel, 
    putType, 
    deleteLevel, 
    changeLevel,
    getMaxLevel
} = require('../models/levels.js');

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

const getOneLevel = async (req, res) =>
{
    const { moduleId, level } = req.params;
    
    try
    {
        const result = await getLevel(moduleId, level);
        if (!result)
            return res.status(404).json({message: "Ese nivel no existe"});
            
        return res.status(200).json(result);
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

const postOneLevel = async (req, res) =>
{
    const { moduleId } = req.params;
    const { type } = req.body;
    
    try
    {
        const level = await getMaxLevel(moduleId) + 1;

        const result = await postLevel(moduleId, level, type);
        
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

const putTwoLevels = async (req, res) =>
{
    const { moduleId } = req.params;
    const { levelId, level, newLevel, newType } = req.body;
    
    try
    {
        const result = await putType(levelId, newType);
        if (!result)
            return res.status(400).json({message: "El tipo no se ha actualizado"});
        
        if (level !== newLevel)
        {
            const levelB = await getLevel(moduleId, newLevel);
            if (!levelB)
                return res.status(400).json({message: "Ese nivel no existe"});

            const result = await changeLevel(levelId, levelB.id, level, newLevel);
            if (!result)
                return res.status(400).json({message: "No se ha podido mover el nivel"});
        }

        return res.status(200).json({message: "Nivel actualizado con exito"});
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

const swapTwoLevels = async (req, res) =>
{
    const { moduleId } = req.params;
    const { levelId, direction } = req.body;
    
    try
    {
        /* Get level A */
        const levelA = await getLevelById(levelId);
        if (!levelA)
            return res.status(400).json({message: "Ese nivel no existe"});

        if (levelA.id_module !== parseInt(moduleId))
            return res.status(400).json({message: "Invalid module"});

        /* Save levels */
        const currLevel = levelA.level;
        const targetLevel = direction === 'up' ? currLevel - 1 : currLevel + 1;

        /* Get level B */
        const levelB = await getLevelModel(moduleId, targetLevel);
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

module.exports = { getOneLevel, getAllLevels, postOneLevel, putTwoLevels, swapTwoLevels, deleteOneLevel};
