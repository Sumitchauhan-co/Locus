import React, { useState, type ReactNode } from 'react';
import { ModalContext } from './ModalContext';
import { type ModalType } from './ModalContext';

interface ProviderProps {
    children: ReactNode;
}

const ModalContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [modalType, setModalType] = useState<ModalType>(null);

    const openModal = (type: Exclude<ModalType, null>) => {
        setModalType(type);
    };

    const closeModal = () => {
        setModalType(null);
    };

    return (
        <ModalContext.Provider value={{ modalType, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export  {ModalContextProvider};
