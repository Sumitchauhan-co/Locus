import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { RxCross1 } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import Container from '../components/LayoutContainer';
import { ModalContext } from '../contexts/ModalContext';
import { AuthContext } from '../contexts/AuthContext';

const Menu: React.FC = () => {
    const { user, logout } = useContext(AuthContext);

    // menu

    const navigate = useNavigate();

    const { openModal, closeModal } = useContext(ModalContext);

    return (
        <Container>
            <section className="min-h-screen max-w-screen flex justify-center items-start relative">
                <div className="absolute right-0">
                    <div className="p-5 grid content-center">
                        <RxCross1
                            onClick={() => (closeModal(), navigate('/'))}
                            className="h-7 w-7 opacity-75"
                        />
                    </div>
                </div>
                <div className="w-full p-5 pt-25 flex flex-col items-start gap-5 text-center">
                    <motion.div
                        onClick={() => (closeModal(), navigate('/'))}
                        whileHover={{ scale: 1.125, y: 1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full p-1 px-3 leading-relaxed font-sans md:text-4xl text-3xl text-start outline-white rounded-lg"
                    >
                        <span>Home</span>
                    </motion.div>
                    <motion.div
                        onClick={() => (closeModal(), navigate('/about'))}
                        whileHover={{ scale: 1.125, y: 1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full p-1 px-3 leading-relaxed font-sans md:text-4xl text-3xl text-start outline-white rounded-lg"
                    >
                        <span>About</span>
                    </motion.div>
                    <motion.div
                        onClick={() => (closeModal(), navigate('/create-post'))}
                        whileHover={{ scale: 1.125, y: 1 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full p-1 px-3 leading-relaxed font-sans md:text-4xl text-3xl text-start outline-white rounded-lg"
                    >
                        <span>Create</span>
                    </motion.div>
                    <motion.div
                        onClick={() => (closeModal(), navigate('/posts'))}
                        whileHover={{ scale: 1.125, y: 1 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full p-1 px-3 leading-relaxed font-sans md:text-4xl text-3xl text-start outline-white rounded-lg"
                    >
                        <span>Posts</span>
                    </motion.div>
                    {!user && (
                        <>
                            <motion.div
                                onClick={() => (
                                    openModal('login'),
                                    navigate('/')
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
                                    navigate('/')
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
