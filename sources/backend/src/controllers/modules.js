const { getModule, getModules, postModule, putModule, deleteModule } = require('../models/modules.js');

const getAllModules = async (req, res) =>
{
    const { courseId } = req.params;

    try
    {
        const modules = await getModules(courseId);
        return res.status(200).json(modules || []);
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

const getOneModule = async (req, res) =>
{
    const { courseId, moduleName } = req.params;

    try
    {
        const module = await getModule(courseId, moduleName);
        if (!module)
            return res.status(409).json({message: "Ese modulo no existe"});

        return res.status(200).json(module);
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

const postOneModule = async (req, res) =>
{
    const { courseId } = req.params;
    const { moduleName } = req.body;
    
    try
    {
        const result = await postModule(courseId, moduleName);
        
        if (!result)
            return res.status(400).json({message: "Ese modulo ya existe"});

        return res.status(200).json({message: "Modulo creado con exito"});
    }
    catch (error)
    {
        console.error("ERROR DETALLADO:", error); 
        return res.status(500).json({message: error});
    }
};

const putOneModule = async (req, res) =>
{
    const { moduleId } = req.params;
    const { moduleNewName } = req.body;

    try
    {
        const result = await putModule(moduleId, moduleNewName);
        if (!result)
            return res.status(400).json({message: "El modulo no se ha actualizado"});

        return res.status(200).json({message: "Modulo actualizado con exito"});
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

const deleteOneModule = async (req, res) =>
{
    const { moduleId } = req.params;

    try
    {
        const result = await deleteModule(moduleId);
        if (!result)
            return res.status(400).json({message: "Error al eliminar el modulo"});

        return res.status(200).json({message: "Curso eliminado con exito"});
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

module.exports = { getOneModule, getAllModules, postOneModule, putOneModule, deleteOneModule };
