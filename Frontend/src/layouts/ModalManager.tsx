import { useContext } from 'react';
import Signup from '../components/Signup';
import { ModalContext } from '../contexts/ModalContext';
import Login from '../components/Login';

function ModalManager() {
    const { modalType } = useContext(ModalContext);

    switch (modalType) {
        case 'login':
            return <Login />;

        case 'signup':
            return <Signup />;

        default:
            return null;
    }
}

export default ModalManager;
