import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import AppRoute from './routes/AppRoute';
import { AuthContext } from './contexts/AuthContext';
import { SiReactivex } from 'react-icons/si';
import Container from './components/LayoutContainer';
import Loader from './components/Loader';

function App(): React.ReactNode {
    const [showApp, setShowApp] = useState(false);
    const { loading, getUser } = useContext(AuthContext);

    useEffect(() => {
        getUser();
    }, []);

    if (loading || !showApp) {
        return (
            <>
                <Container>
                    <div className="h-screen w-full flex flex-col justify-center items-center gap-3">
                        <div className="h-10 w-10 flex justify-center items-center animate-spin">
                            <SiReactivex className="h-10 w-10"></SiReactivex>
                        </div>
                        <Loader onFinish={() => setShowApp(true)} />
                    </div>
                </Container>
            </>
        );
    }
    return <AppRoute />;
}

export default App;
