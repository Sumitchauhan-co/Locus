import axios from 'axios';
import { getAccessToken, setAccessToken } from '../utils/TokenService.ts';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;

            try {
                const res = await api.post('/api/auth/refresh');

                const newToken = res.data.accessToken;

                setAccessToken(newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;

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