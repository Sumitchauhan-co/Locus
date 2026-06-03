import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import AppRoute from './routes/AppRoute';
import { AuthContext } from './contexts/AuthContext';
import Loader from './components/Loader';
import Container from './components/LayoutContainer';
import Loading2 from './components/Loading2';
import { useSearchParams } from 'react-router-dom';
import { setAccessToken } from './utils/TokenService';
import api from './api/axios';

// 🌟 Simple helper to decode JWT payloads safely on the frontend without extra libraries
const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        console.log(e);

        return null;
    }
};

function App(): React.ReactNode {
    const [showApp, setShowApp] = useState(false);
    const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);

    const { loading, getUser, setUser } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {
        const initializeSession = async () => {
            if (code) {
                try {
                    // 1. Trade authorization code for tokens
                    const res = await api.post('/api/auth/callback', { code });
                    const userAccessToken = res.data.accessToken;
                    const idToken = res.data.id_token; // Grab the id_token from your OIDC provider

                    setAccessToken(userAccessToken);

                    // 2. Wipe the code out of the URL bar
                    window.history.replaceState({}, document.title, '/');

                    // 3. Decode user details instantly from the OIDC idToken payload
                    // This bypasses the need to wait for a database round-trip!
                    const userData = parseJwt(idToken || userAccessToken);

                    if (userData) {
                        const user = {
                            _id: userData.sub,
                            email: userData.email,
                            username: [userData.firstName, userData.lastName]
                                .filter(Boolean)
                                .join(' '),
                            accessToken: userAccessToken,
                        };
                        setUser(user);
                    } else {
                        // Fallback if token decoding fails for some reason
                        await getUser();
                    }
                } catch (err) {
                    console.error('Auth Flow failed', err);
                }
            } else {
                // 4. Only check standard session if no authentication code is present
                try {
                    await getUser();
                } catch (err) {
                    console.error('Silent login verification failed', err);
                }
            }
        };

        initializeSession();
    }, [code]);

    // Orientation checking logic
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
