import React, { useContext } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../contexts/ModalContext';
import { AuthContext } from '../contexts/AuthContext';
import { Icons } from '../utils/icons';
import { getBgColor } from '../utils/bgColor';

const linkVariants: Variants = {
    hover: { scale: 1.125, y: 1 },
    tap: { scale: 0.975 },
};

const Navbar: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const { openModal, closeModal } = useContext(ModalContext);
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

    const initial = user?.username?.charAt(0).toUpperCase() || 'U';
    const bgColor = getBgColor(user?.username || '');

    const baseLinks = [
        { label: 'Home', path: '/' },
        { label: 'Create', path: '/create-post' },
        { label: 'Posts', path: '/posts' },
        { label: 'Map', path: '/map' },
        { label: 'Contact', path: '/contact' },
        { label: 'About', path: '/about' },
    ];

    const linkStyle =
        'p-1 hover:text-(--text-color2) cursor-pointer px-3 font-bold text-lg sm:text-xl xl:text-2xl outline-white rounded-lg';

    const handleNavigation = (path: string) => {
        closeModal();
        navigate(path);
    };

    return (
        <nav className="relative p-5 z-99999 flex justify-between items-center">
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
            <div
                className={`h-full ${user ? 'lg:w-4/7 w-3/4' : 'w-6/7 lg:w-3/4'} hidden md:flex justify-between items-center font-[sans-serif]`}
            >
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
                    <>
                        <motion.div
                            variants={linkVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => logout()}
                            className={linkStyle}
                        >
                            <span>Logout</span>
                        </motion.div>
                        <div
                            className={`h-8 w-8 flex items-center justify-center rounded-full text-(--text-color) font-bold ${bgColor} border-2 border-white shadow-sm`}
                        >
                            <span>{initial}</span>
                        </div>
                    </>
                )}
            </div>
            <div className="flex justify-center items-center gap-5 md:hidden">
                <div
                    className={`h-8 w-8 flex items-center justify-center rounded-full text-(--text-color) font-bold ${bgColor} border-2 border-white shadow-sm`}
                >
                    <span>{initial}</span>
                </div>
                <div
                    onClick={() => navigate('/menu')}
                    className="flex cursor-pointer"
                >
                    <Icons.menu className="h-7 w-7" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
