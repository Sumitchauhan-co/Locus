import React, { useContext, useEffect } from 'react';
import './App.css';
import AppRoute from './routes/AppRoute';
import { AuthContext } from './contexts/AuthContext';

function App(): React.ReactNode {
    const { getUser } = useContext(AuthContext);
    useEffect(() => {
        getUser();
    }, []);
    return <AppRoute />;
}

export default App;
