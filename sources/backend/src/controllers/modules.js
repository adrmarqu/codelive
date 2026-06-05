const { getModules } = require('../models/modules.js');

const getAllModules = async (req, res) =>
{
    const { courseId } = req.params;
    try
    {
        const modules = await getModules(courseId);
        return res.status(200).json(modules.rows);
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

module.exports = { getAllModules };
