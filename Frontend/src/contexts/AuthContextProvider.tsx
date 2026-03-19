import React, { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { type User, type Data } from './AuthContext';
import api from '../api/axios';
import axios from 'axios';

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
            return { statusCode: res.status, errorMessage: undefined };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;
                const errorMessage = error.response?.data?.message;
                // console.log(error.response?.status);
                return { statusCode, errorMessage };
            }
        }
    };

    const login = async (data: Data) => {
        try {
            await api.post('/api/auth/login', data);
            const res = await api.get('/api/auth/user');
            console.log(res);

            setUser(res.data.user);
            return { statusCode: res.status, errorMessage: undefined };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;
                const errorMessage = error.response?.data?.message;
                // console.log(error.response?.status);
                return { statusCode, errorMessage };
            }
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await api.post('/api/auth/logout');

            setUser(null);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                signup,
                getUser,
                loading,
                setLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContextProvider };
