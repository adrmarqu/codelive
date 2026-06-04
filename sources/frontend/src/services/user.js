/* Datos del usuario + progreso */

export const getUserRole = async () =>
{
    const token = localStorage.getItem('token');
    
    if (!token) return 'guest';

    try
    {
        const response = await fetch('http://localhost:5000/api/user/me',
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
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