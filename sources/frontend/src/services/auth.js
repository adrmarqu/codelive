import api from './api.js';

export const checkForm = async (name, formData) =>
{
    try
    {
        const payload = Object.fromEntries(formData.entries());
        // Map form action names to actual routes if needed (e.g. login/signin)
        const response = await api.post(`/api/auth/${name}`, payload);

        const { data } = response;

        if (name === 'login' && data.token) {
            localStorage.setItem('token', data.token);
        }

        return { success: true, data };
    } 
    catch (error)
    {
        const errorMessage = error.response?.data?.message || "Error al enviar";
        return { success: false, error: errorMessage };
    }
};