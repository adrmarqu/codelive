import axios from 'axios';

const api = axios.create(
{
    baseURL: 'http://localhost:3000/api/auth'
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