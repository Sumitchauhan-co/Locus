import React, { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { type User, type Data } from './AuthContext';
import api from '../api/axios';
import axios from 'axios';
import { setAccessToken } from '../utils/TokenService';

interface ProviderProps {
    children: ReactNode;
}

const AuthContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const signup = async (data: Data) => {
        try {
            await api.post('/api/auth/register', data);

            const res = await api.get('/api/auth/user');
            setUser(res.data.user);
            setAccessToken(res.data.accessToken);
            return { statusCode: res.status, errorMessage: undefined };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;
                const errorMessage = error.response?.data?.message;
                return { statusCode, errorMessage };
            }
        }
    };

    const login = async (data: Data) => {
        try {
            await api.post('/api/auth/login', data);

            const res = await api.get('/api/auth/user');
            setUser(res.data.user);
            setAccessToken(res.data.accessToken);

            return { statusCode: res.status, errorMessage: undefined };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;
                const errorMessage = error.response?.data?.message;
                return { statusCode, errorMessage };
            }
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            const response = await api.post('/api/auth/logout');

            setUser(null);
            setAccessToken(null);
            const centralLogoutUrl = response.data.redirectUrl;

            if (centralLogoutUrl) {
                window.location.href = centralLogoutUrl;
            } else {
                window.location.href = '/login';
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getUser = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/auth/user');
            setUser(res.data.user);
        } catch (error) {
            console.log(error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const contextValue = {
        user,
        setUser,
        login,
        logout,
        signup,
        getUser,
        loading,
        setLoading,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContextProvider };
