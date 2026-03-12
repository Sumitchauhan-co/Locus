import { createContext } from 'react';

export type User = {
    _id: string;
    username: string;
    email: string;
    password: string;
};


export type Data = {
    username: string | undefined;
    email: string | undefined;
    password: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    getUser: () => void;
    login: (user: Data) => void;
    signup: (user: Data) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    getUser: () => {},
    login: () => {},
    signup: () => {},
    logout: () => {},
});

export { AuthContext };
