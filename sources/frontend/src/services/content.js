/* Contenido principal de learn y edit */

export const getCourses = async () =>
{
    const dir = 'http://localhost:5000/api/edit/courses';

    try
    {
        const response = await fetch(dir);
        const data = await response.json();

        console.log("DATA:", data);

        return data.rows;
    }
    catch (error)
    {
        console.error("Error to import courses:", error);
        return null;
    }
};

export const getModules = async (course) =>
{
    const dir = `http://localhost:5000/api/edit/${course}`;

    try
    {
        const response = await fetch(dir);
        const data = await response.json();

        console.log("DATA:", data);

        return data.rows;
    }
    catch (error)
    {
        console.error("Error to import modules:", error);
        return null;
    }
};

export const getCourse = async (course) =>
{
    const dir = `http://localhost:5000/api/edit/courses/${course}`;
    
    try
    {
        const response = await fetch(dir,
        {
            method: 'GET',
            headers:
            {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok)
            throw new Error(`Error B`);

        return await response.json();
    }
    catch (error)
    {
        console.error("Error to import course:", error);
        return null;
    }
};

export const handleCreateCourse = async (data, creatorId) =>
{
    try
    {
        const courseName = data.course;
        
        const response = await fetch(`http://localhost:5000/api/edit/courses/${creatorId}/${encodeURIComponent(courseName)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) console.error("Curso no creado");
        return true;
    } 
    catch (error)
    {
        return false;
    }
};

export const handleCreateModule = async (data, creatorId) =>
{
    try
    {
        const courseName = data.course;
        const moduleName = data.module;
        
        const response = await fetch(`http://localhost:5000/api/edit/courses/${creatorId}/${encodeURIComponent(courseName)}/${encodeURIComponent(moduleName)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) console.error("Modulo no creado");
        return true;
    } 
    catch (error)
    {
        return false;
    }
};