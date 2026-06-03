/* Datos del usuario + progreso */

export const getUserRole = async () =>
{
    try
    {
        const response = await fetch('http://localhost:5000/api/user/me',
        {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) return 'guest';

        const data = await response.json();

        return data.rol || 'guest';
    }
    catch (error) 
    {
        console.error("Error (getUserRole):", error);
        return 'guest';
    }
};