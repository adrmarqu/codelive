import axios from 'axios';

const api = axios.create(
{
    baseURL: 'http://localhost:3000/api/user'
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