import axios from 'axios';

//const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = 'https://codelive-pvo7.vercel.app'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach authorization token if it exists in local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
