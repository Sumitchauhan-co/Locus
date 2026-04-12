import React, { useContext } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../contexts/ModalContext';
import { AuthContext } from '../contexts/AuthContext';
import { Icons } from '../utils/icons';

const linkVariants: Variants = {
    hover: { scale: 1.125, y: 1 },
    tap: { scale: 0.975 }
};

const Navbar: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const { openModal, closeModal } = useContext(ModalContext);
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

    const baseLinks = [
        { label: 'Home', path: '/' },
        { label: 'Create', path: '/create-post' },
        { label: 'Posts', path: '/posts' },
        { label: 'Map', path: '/map' },
        { label: 'Contact', path: '/contact' },
        { label: 'About', path: '/about' },
    ];

    const linkStyle = "p-1 hover:text-(--text-color2) cursor-pointer px-3 font-bold text-lg sm:text-xl xl:text-2xl outline-white rounded-lg";

    const handleNavigation = (path: string) => {
        closeModal();
        navigate(path);
    };

    return (
        <nav className="relative p-5 z-99999 flex justify-between items-center">
            {/* Logo Section */}
            <motion.div
                style={{ rotate }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                whileDrag={{ rotate: -360 }}
                transition={{ duration: 0.8 }}
                className="h-10 w-10 flex justify-center items-center cursor-grab active:cursor-grabbing"
            >
                <Icons.logo className="h-10 w-10" />
            </motion.div>

            {/* Desktop Links Container */}
            <div className={`h-full ${user ? 'lg:w-4/7 w-5/7' : 'w-4/5 lg:w-3/4'} hidden md:flex justify-between items-center font-[sans-serif]`}>
                
                {/* Map through base links */}
                {baseLinks.map((link) => (
                    <motion.div
                        key={link.path}
                        variants={linkVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleNavigation(link.path)}
                        className={linkStyle}
                    >
                        <span>{link.label}</span>
                    </motion.div>
                ))}

                {/* Auth-Dependent Links */}
                {!user ? (
                    <>
                        <motion.div
                            variants={linkVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => openModal('login')}
                            className={linkStyle}
                        >
                            <span>Login</span>
                        </motion.div>
                        <motion.div
                            variants={linkVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => openModal('signup')}
                            className={linkStyle}
                        >
                            <span>Signup</span>
                        </motion.div>
                    </>
                ) : (
                    <motion.div
                        variants={linkVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => logout()}
                        className={linkStyle}
                    >
                        <span>Logout</span>
                    </motion.div>
                )}
            </div>

            {/* Mobile Menu Icon */}
            <div onClick={() => navigate('/menu')} className="md:hidden flex cursor-pointer">
                <Icons.menu className="h-7 w-7" />
            </div>
        </nav>
    );
};

export default Navbar;