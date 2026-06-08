import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create(
{
    baseURL: `${API_URL}/api/user` 
});

export const getUserData = async () =>
{
    const token = localStorage.getItem('token');
    
    if (!token) return 'guest';

    try
    {
        const response = await api.get('/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data;
        localStorage.setItem('user', JSON.stringify(data));
        
        return data.rol || 'guest';
    }
    catch (error)
    {
        console.error("Error (getUserRole):", error);
        return 'guest';
    }
};