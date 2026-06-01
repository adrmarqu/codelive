/* Datos del usuario + progreso */

export const getUserRole = async () =>
{
    try
    {
        const response = await fetch('api/me');

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