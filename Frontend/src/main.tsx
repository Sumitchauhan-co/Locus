// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ModalContextProvider } from './contexts/ModalContextProvider';
import { AuthContextProvider } from './contexts/AuthContextProvider';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AuthContextProvider>
            <ModalContextProvider>
                <App />
            </ModalContextProvider>
        </AuthContextProvider>
    </BrowserRouter>,
);
