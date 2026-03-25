import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import AppRoute from './routes/AppRoute';
import { AuthContext } from './contexts/AuthContext';
import Loader from './components/Loader';

function App(): React.ReactNode {
    const [showApp, setShowApp] = useState(false);
    const { loading, getUser } = useContext(AuthContext);

    useEffect(() => {
        getUser();
    }, []);

    if (loading || !showApp) {
        return <Loader onFinish={() => setShowApp(true)} />;
    }

    return <AppRoute />;
}

export default App;
