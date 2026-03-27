import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// @NOTE: Este interceptor se ejecuta antes de cada solicitud y agrega el token de autenticación al encabezado Authorization si está presente en el localStorage. Esto asegura que todas las solicitudes a la API incluyan el token de autenticación, lo que es necesario para acceder a los endpoints protegidos.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;