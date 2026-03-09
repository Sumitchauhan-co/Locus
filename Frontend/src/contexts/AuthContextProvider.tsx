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

    const signup = async (data: Data) => {
        try {
            const res = await api.post('/api/auth/register', data);

            setUser(res.data.user);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data);
            }
        }
    };

    const login = async (data: Data) => {
        try {
            const res = await api.post('/api/auth/login', data);

            setUser(res.data.user);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data);
            }
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/logout');

            setUser(null);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data);
            }
        }
    };

    const getUser = async () => {
        try {
            const res = await api.get('/api/auth/user');

            setUser(res.data.user);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, getUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContextProvider };
