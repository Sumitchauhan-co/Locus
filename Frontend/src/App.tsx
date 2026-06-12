import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import AppRoute from './routes/AppRoute';
import { AuthContext } from './contexts/AuthContext';
import Container from './components/LayoutContainer';
import Loading2 from './components/Loading2';
import Loader from './components/Loader';

function App(): React.ReactNode {
    const [showApp, setShowApp] = useState(false);
    const [isLandscapeMobile] = useState(false);

    const { loading, getUser } = useContext(AuthContext);

    useEffect(() => {
        getUser();
    }, []);

    // ... Orientation checking logic remains exactly the same ...

    if (isLandscapeMobile) {
        return (
            <Container>
                <div className="min-h-screen w-full flex justify-center flex-col items-center gap-3">
                    <Loading2 />
                    <span className="text-white animate-pulse text-lg">
                        Rotate back!
                    </span>
                </div>
            </Container>
        );
    }

    // Pass the auth loading state into the Loader component
    if (loading || !showApp) {
        return (
            <Loader
                isAuthLoading={loading}
                onFinish={() => setShowApp(true)}
            />
        );
    }

    return <AppRoute />;
}

export default App;
