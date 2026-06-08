import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create(
{
    baseURL: `${API_URL}/api/auth` 
});

export const checkForm = async (name, formData) =>
{
    try
    {
        const payload = Object.fromEntries(formData.entries());
        const response = await api.post(`/${name}`, payload);

        const { data } = response;

        console.log("TOKEN:", data.token);

        if (name === 'login' && data.token)
            localStorage.setItem('token', data.token);

        return { success: true, data };
    } 
    catch (error)
    {
        const errorMessage = error.response?.data?.message || "Error al enviar";
        return { success: false, error: errorMessage };
    }
};