import React, { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { type User, type Data } from './AuthContext';
import api from '../api/axios';

interface ProviderProps {
    children: ReactNode;
}

const AuthContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const signup = async (data: Data) => {
        try {
            const res = await api.post('/api/auth/register', data);
            console.log(res);
            

            setUser(res.data.user);
        } catch (error) {
            console.log(error);
        }
    };

    const login = async (data: Data) => {
        try {
            const res = await api.post(
                '/api/auth/login',
                data,
            );

            setUser(res.data.user);
        } catch (error) {
            console.log(error);
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/logout');

            setUser(null);
        } catch (error) {
            console.log(error);
        }
    };

    const getUser = async () => {
        try {
            const res = await api.get('/api/auth/user');

            setUser(res.data.user);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, getUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContextProvider };
