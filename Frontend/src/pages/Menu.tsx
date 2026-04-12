import React, { useContext } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Icons } from '../utils/icons';
import { useNavigate } from 'react-router-dom';
import Container from '../components/LayoutContainer';
import { ModalContext } from '../contexts/ModalContext';
import { AuthContext } from '../contexts/AuthContext';
import { ScrollToTop } from '../components/ScrollTo';

const linkVariants: Variants = {
    hover: { scale: 1.125, y: 1 },
    tap: { scale: 0.975 }
};

const Menu: React.FC = () => {
    const { user, logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const { openModal, closeModal } = useContext(ModalContext);

    const baseLinks = [
        { label: 'Home', path: '/' },
        { label: 'Create', path: '/create-post' },
        { label: 'Posts', path: '/posts' },
        { label: 'Map', path: '/map' },
        { label: 'Contact', path: '/contact' },
        { label: 'About', path: '/about' },
    ];

    const linkStyle =
        'w-full p-1 px-3 leading-relaxed font-sans md:text-4xl text-3xl text-start outline-white rounded-lg';

    const handleNavigation = (path: string) => {
        closeModal();
        navigate(path);
    };

    return (
        <Container>
            <ScrollToTop />

            <section className="min-h-screen max-w-screen flex justify-center items-start relative">
                <div className="absolute right-0">
                    <div className="p-5 grid content-center">
                        <Icons.cross
                            onClick={() => (navigate(-1), closeModal())}
                            className="h-7 w-7 opacity-75"
                        />
                    </div>
                </div>
                <div className="w-full p-5 pt-25 flex flex-col items-start gap-5 text-center">
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
                    {!user && (
                        <>
                            <motion.div
                                onClick={() => (
                                    openModal('login'),
                                    navigate(-1)
                                )}
                                whileHover={{ scale: 1.125, y: 1 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full p-1 px-3 leading-relaxed font-sans md:text-4xl text-3xl text-start outline-white rounded-lg"
                            >
                                <span>Login</span>
                            </motion.div>
                            <motion.div
                                onClick={() => (
                                    openModal('signup'),
                                    navigate(-1)
                                )}
                                whileHover={{ scale: 1.125, y: 1 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full p-1 px-3 leading-relaxed font-sans md:text-4xl text-3xl text-start outline-white rounded-lg"
                            >
                                <span>Signup</span>
                            </motion.div>
                        </>
                    )}
                    {user && (
                        <>
                            <motion.div
                                onClick={() => (logout(), navigate('/'))}
                                whileHover={{ scale: 1.125, y: 1 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full p-1 px-3 leading-relaxed font-sans md:text-4xl text-3xl text-start outline-white rounded-lg"
                            >
                                <span>Logout</span>
                            </motion.div>
                        </>
                    )}
                </div>
            </section>
        </Container>
    );
};

export default Menu;
