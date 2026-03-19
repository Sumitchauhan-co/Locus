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

interface returnObj {
    statusCode: number | undefined;
    errorMessage: string | undefined;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    setLoading: (arg: boolean) => void;
    getUser: () => void;
    login: (user: Data) => Promise<returnObj | undefined>;
    signup: (user: Data) => Promise<returnObj | undefined>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    setLoading: () => {},
    getUser: () => {},
    login: async () => undefined,
    signup: async () => undefined,
    logout: () => {},
});

export { AuthContext };
