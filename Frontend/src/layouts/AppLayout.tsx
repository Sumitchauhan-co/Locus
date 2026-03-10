import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '../components/LayoutContainer';
import ModalManager from './ModalManager';

const Applayout: React.FC = () => {
    return (
        <Container>
            <Navbar />
            <Outlet />
            <ModalManager />
            <Footer />
        </Container>
    );
};

export default Applayout;
