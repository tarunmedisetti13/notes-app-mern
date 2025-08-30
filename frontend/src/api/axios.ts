// src/api/axios.ts
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URI, // backend URL
});

// Attach token automatically if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
