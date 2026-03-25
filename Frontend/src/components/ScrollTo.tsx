import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export const ScrollToBottom = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth',
    });
};
