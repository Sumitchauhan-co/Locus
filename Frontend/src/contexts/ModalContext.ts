import { createContext } from 'react';

export type ModalType = 'login' | 'signup' | null;

interface ModalContextType {
    modalType: ModalType;
    openModal: (type: Exclude<ModalType, null>) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
    modalType: null,
    openModal: () => {},
    closeModal: () => {},
});


export {ModalContext}
