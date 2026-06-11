import api from './api.js';

export const getUserData = async () =>
{
    try
    {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
        sessionStorage.removeItem('token');
        return 'guest';
    }
};
export const getFullUserData = async () =>
{
    try
    {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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

/* ---- Perfil ---- */
export const getProfileRequest = () =>
    api.get('/api/user/profile');

export const updateUsernameRequest = (username) =>
    api.put('/api/user/profile/username', { username });

export const updateEmailRequest = (email) =>
    api.put('/api/user/profile/email', { email });

export const updatePasswordRequest = (current, pass, rep) =>
    api.put('/api/user/profile/password', { current, pass, rep });

export const deleteAccountRequest = () =>
    api.delete('/api/user/profile');

/* ---- Estadísticas ---- */
export const getProgressRequest = () =>
    api.get('/api/user/progress');

export const getUserProgressRequest = (username) =>
    api.get(`/api/user/progress/${username}`);

export const getRankingRequest = (type = 'global') =>
    api.get(`/api/user/ranking?type=${type}`);

/* ---- Contacto ---- */
export const sendContactRequest = (comment, email, role) =>
    api.post(`/api/user/contact/${role}`, { comment, email });

export const getContactsRequest = () =>
    api.get('/api/user/contact');

/* ---- Lista de usuarios (admin) ---- */
export const getUsersRequest = (params = {}) =>
    api.get('/api/user/list', { params });

export const changeRoleRequest = (id, rol) =>
    api.put(`/api/user/list/${id}/role`, { rol });

export const deleteUserRequest = (id) =>
    api.delete(`/api/user/list/${id}`);