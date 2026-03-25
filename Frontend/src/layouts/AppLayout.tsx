import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '../components/LayoutContainer';
import ModalManager from './ModalManager';

const Applayout: React.FC = () => {
    return (
        <Container>
            <header className='sticky z-1 top-0 bg-(--secondary-color)/50 backdrop-blur-lg'>
                <Navbar />
            </header>
            <main id='main-content'>
                <Outlet />
                <ModalManager />
            </main>
            <footer>
                <Footer />
            </footer>
        </Container>
    );
};

export default Applayout;
