import axios from 'axios';
import { getAccessToken, setAccessToken } from '../utils/TokenService.ts';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();

    const skipUrls = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh'];

    if (skipUrls.some(url => config.url?.includes(url))) {
        return config;
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (
            originalRequest.url?.includes('/api/auth/login') ||
            originalRequest.url?.includes('/api/auth/register') ||
            originalRequest.url?.includes('/api/auth/refresh')
        ) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            originalRequest._retry = true;

            try {
                const res = await api.post('/api/auth/refresh');

                const newAccessToken = res.data.accessToken;

                setAccessToken(newAccessToken);

                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (err) {
                setAccessToken(null);
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;