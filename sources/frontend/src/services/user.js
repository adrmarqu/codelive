import api from './api.js';

export const getUserData = async () =>
{
    try
    {
        const token = localStorage.getItem('token');
        if (!token) return 'guest';

        const response = await api.get('/api/user/me');

        console.log("DEVOLVIENDO ROL:", response.data.rol);
        return response.data.rol;
    }
    catch (error)
    {
        console.error("Error al obtener datos:", error);
        // If the token is invalid or expired, clear it
        localStorage.removeItem('token');
        return 'guest';
    }
};
export const getFullUserData = async () =>
{
    try
    {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await api.get('/api/user/me');
        return response.data;
    }
    catch (error)
    {
        console.error("Error al obtener datos del usuario:", error);
        return null;
    }
};