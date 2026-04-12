import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import AppRoute from './routes/AppRoute';
import { AuthContext } from './contexts/AuthContext';
import Loader from './components/Loader';
import Container from './components/LayoutContainer';
import Loading2 from './components/Loading2';

function App(): React.ReactNode {
    const [showApp, setShowApp] = useState(false);
    const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);

    const { loading, getUser } = useContext(AuthContext);

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        const checkOrientation = () => {
            const isMobile = window.innerWidth <= 768;
            const isLandscape = window.innerWidth > window.innerHeight;

            setIsLandscapeMobile(isMobile && isLandscape);
        };

        checkOrientation();

        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

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

    if (loading || !showApp) {
        return <Loader onFinish={() => setShowApp(true)} />;
    }

    return <AppRoute />;
}

export default App;