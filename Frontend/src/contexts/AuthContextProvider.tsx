import React, { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { type User, type Data } from './AuthContext';
import axios from 'axios';

interface ProviderProps {
    children: ReactNode;
}

const AuthContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const signup = async (data: Data) => {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/auth/register',
                data,
                { withCredentials: true },
            );

            setUser(res.data.user);
        } catch (error) {
            console.log(error);
        }
    };

    const login = async (data: Data) => {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/auth/login',
                data,
                { withCredentials: true },
            );

            setUser(res.data.user);
        } catch (error) {
            console.log(error);
        }
    };

    const logout = async () => {
        try {
            await axios.post(
                'http://localhost:3000/api/auth/logout',
                {},
                { withCredentials: true },
            );

            setUser(null);
        } catch (error) {
            console.log(error);
        }
    };

    const getUser = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/auth/user', {
                withCredentials: true,
            });

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
