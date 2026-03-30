import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import AppRoute from './routes/AppRoute';
import { AuthContext } from './contexts/AuthContext';
// import Loader from './components/Loader';
// import Loader2 from './components/Loader2';
import Loader3 from './components/Loader3';

function App(): React.ReactNode {
    const [showApp, setShowApp] = useState(false);
    const { loading, getUser } = useContext(AuthContext);

    useEffect(() => {
        getUser();
    }, []);

    if (!loading || !showApp) {
        return <Loader3 onFinish={() => setShowApp(false)} />;
    }

    return <AppRoute />;
}

export default App;
