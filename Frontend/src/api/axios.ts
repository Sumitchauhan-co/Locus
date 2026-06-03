import axios from 'axios';
import { getAccessToken, setAccessToken } from '../utils/TokenService';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();

        const skipUrls = [
            '/api/auth/login',
            '/api/auth/register',
            '/api/auth/refresh',
            '/api/auth/callback',
        ];

        const isSkipUrl = skipUrls.some((url) => config.url?.includes(url));

        if (token && !isSkipUrl) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        const authUrls = [
            '/api/auth/login',
            '/api/auth/register',
            '/api/auth/refresh',
        ];
        if (authUrls.some((url) => originalRequest.url?.includes(url))) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
                {},
                {
                    withCredentials: true,
                },
            );

            const newAccessToken = res.data.accessToken;

            if (newAccessToken) {
                setAccessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            }
        } catch (err) {
            console.error('Token refresh failed:', err);
            setAccessToken(null);
            return Promise.reject(err);
        }

        return Promise.reject(error);
    },
);

export default api;
