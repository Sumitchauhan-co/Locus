import React, { useContext } from 'react';
import { SiReactivex } from 'react-icons/si';
import { motion, useScroll, useTransform } from 'motion/react';
import { TiThMenu } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../contexts/ModalContext';
import { AuthContext } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout } = useContext(AuthContext);

    const { openModal, closeModal } = useContext(ModalContext);

    // framer motion

    const { scrollYProgress } = useScroll();

    // const top = useTransform(scrollYProgress, [0, 1], ['0px', '0px']);

    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

    // menu

    const navigate = useNavigate();

    return (
        <motion.nav
            // style={{ top }}
            className="p-5 sticky top-0 z-99 flex justify-between items-center bg-(--secondary-color)"
        >
            <motion.div
                style={{ rotate }}
                drag
                dragConstraints={{
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                }}
                whileDrag={{
                    rotate: 360,
                }}
                transition={{
                    duration: 0.8,
                }}
                className="h-10 w-10 flex justify-center items-center"
            >
                <SiReactivex className="h-10 w-10" />
            </motion.div>
            <div
                className={`h-full ${user ? 'lg:w-3/5 w-4/5' : 'w-3/4'} hidden md:flex justify-between items-center font-[sans-serif]`}
            >
                <motion.div
                    onClick={() => (closeModal(), navigate('/'))}
                    whileHover={{ scale: 1.125, y: 1 }}
                    whileTap={{ scale: 0.975 }}
                    className="p-1 hover:text-(--text-color2) cursor-pointer px-3 font-bold text-lg sm:text-xl xl:text-2xl outline-white rounded-lg"
                >
                    <span>Home</span>
                </motion.div>
                <motion.div
                    onClick={() => (closeModal(), navigate('/about'))}
                    whileHover={{ scale: 1.125, y: 1 }}
                    whileTap={{ scale: 0.975 }}
                    className="p-1 hover:text-(--text-color2) cursor-pointer px-3 font-bold text-lg sm:text-xl xl:text-2xl outline-white rounded-lg"
                >
                    <span>About</span>
                </motion.div>
                <motion.div
                    onClick={() => navigate('/contact')}
                    whileHover={{ scale: 1.125, y: 1 }}
                    whileTap={{ scale: 0.975 }}
                    className="p-1 hover:text-(--text-color2) cursor-pointer px-3 font-bold text-lg sm:text-xl xl:text-2xl outline-white rounded-lg"
                >
                    <span>Contact</span>
                </motion.div>
                <motion.div
                    onClick={() => (closeModal(), navigate('/create-post'))}
                    whileHover={{ scale: 1.125, y: 1 }}
                    whileTap={{ scale: 0.975 }}
                    className="p-1 hover:text-(--text-color2) cursor-pointer px-3 font-bold text-lg sm:text-xl xl:text-2xl outline-white rounded-lg"
                >
                    <span>Create</span>
                </motion.div>
                <motion.div
                    onClick={() => (closeModal(), navigate('/posts'))}
                    whileHover={{ scale: 1.125, y: 1 }}
                    whileTap={{ scale: 0.975 }}
                    className="p-1 hover:text-(--text-color2) cursor-pointer px-3 font-bold text-lg sm:text-xl xl:text-2xl outline-white rounded-lg"
                >
                    <span>Posts</span>
                </motion.div>
                {!user && (
                    <>
                        <motion.div
                            onClick={() => openModal('login')}
                            whileHover={{ scale: 1.125, y: 1 }}
                            whileTap={{ scale: 0.975 }}
                            className="p-1 hover:text-(--text-color2) cursor-pointer px-3 font-bold text-lg sm:text-xl xl:text-2xl outline-white rounded-lg"
                        >
                            <span>Login</span>
                        </motion.div>
                        <motion.div
                            onClick={() => openModal('signup')}
                            whileHover={{ scale: 1.125, y: 1 }}
                            whileTap={{ scale: 0.975 }}
                            className="p-1 hover:text-(--text-color2) cursor-pointer px-3 font-bold text-lg sm:text-xl xl:text-2xl outline-white rounded-lg"
                        >
                            <span>Signup</span>
                        </motion.div>
                    </>
                )}
                {user && (
                    <>
                        <motion.div
                            onClick={() => logout()}
                            whileHover={{ scale: 1.125, y: 1 }}
                            whileTap={{ scale: 0.975 }}
                            className="p-1 hover:text-(--text-color2) cursor-pointer px-3 font-bold text-lg sm:text-xl xl:text-2xl outline-white rounded-lg"
                        >
                            <span>Logout</span>
                        </motion.div>
                    </>
                )}
            </div>
            <div
                onClick={() => navigate('/menu')}
                className="md:hidden flex"
            >
                <TiThMenu className="h-5 w-5" />
            </div>
        </motion.nav>
    );
};

export default Navbar;
