import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import AppRoute from './routes/AppRoute';
import { AuthContext } from './contexts/AuthContext';
// import Loader from './components/Loader';
// import Loader2 from './components/Loader2';
import Loader3 from './components/Loader3';
import Container from './components/LayoutContainer';
import Loading2 from './components/Loading2';

function App(): React.ReactNode {
    const [showApp, setShowApp] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);
    const { loading, getUser } = useContext(AuthContext);

    useEffect(() => {
        getUser();
    }, []);

    
    useEffect(() => {
        const checkOrientation = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };

        checkOrientation();

        window.addEventListener('resize', checkOrientation);

        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    if (isLandscape) {
        return (
            <Container>
                <div className="min-h-screen w-full flex justify-center flex-col items-center gap-3">
                    <Loading2 />
                    <span className="text-white animate-pulse">
                        Rotate back!
                    </span>
                </div>
            </Container>
        );
    }

    if (loading || !showApp) {
        return <Loader3 onFinish={() => setShowApp(true)} />;
    }

    return <AppRoute />;
}

export default App;
