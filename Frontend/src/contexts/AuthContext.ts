import { createContext } from 'react';

export type User = {
    id: string;
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
    getUser: () => void;
    login: (user: Data) => void;
    signup: (user: Data) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    getUser: () => {},
    login: () => {},
    signup: () => {},
    logout: () => {},
});

export { AuthContext };
