import React from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@react-hook/media-query';
import { NavLink } from 'react-router-dom';

const Cards: React.FC = () => {
    const isDesktop = useMediaQuery('(min-width: 640px)');

    return (
        <section className="h-fit w-full flex flex-col mt-50 mb-25 gap-10">
            <div className="text-5xl sm:text-6xl flex flex-col gap-3 text-center">
                <h2>Share your journey instantly</h2>
                <div className="h-full flex justify-center items-center">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: isDesktop ? 800 : 300 }}
                        transition={{ duration: 1 }}
                        className="h-1 bg-pink-500 rounded-full"
                    ></motion.div>
                </div>
            </div>
            <div className="h-fit w-full flex flex-col p-5 sm:mt-25 mt-15 gap-10 sm:gap-25">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="h-fit w-full border border-(--border-color) rounded-lg hover:bg-(--secondary-color) p-5 sm:p-10 flex sm:flex-row flex-col gap-10"
                >
                    <div className="sm:w-1/2 w-full flex flex-col items-center justify-center sm:gap-10 gap-5">
                        <h2 className="w-full text-3xl sm:text-4xl text-(--text-pink-color) text-center">
                            "Full support for high-resolution imagery and
                            dynamic text layouts."
                        </h2>
                        <div className="sm:p-3 p-2 sm:px-10 px-7 rounded-4xl border-5 border-(--border-color2) hover:bg-(--tertiary-color) active:bg-(--tertiary-color) bg-(--quaternary-color)">
                            <NavLink
                                to={'/posts'}
                                className="hover:underline active:underline sm:text-lg"
                            >
                                Go to Posts →
                            </NavLink>
                        </div>
                    </div>
                    <div className="sm:w-1/2 w-full">
                        <div className="w-full flex justify-center items-center">
                            <img
                                className="sm:h-175 aspect-[16:9]"
                                src="/feat-post.webp"
                                alt="post feature"
                            />
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="h-fit w-full border border-(--border-color) rounded-lg hover:bg-(--secondary-color) p-5 sm:p-10 flex sm:flex-row flex-col gap-10"
                >
                    <div className="sm:w-1/2 w-full flex flex-col justify-center items-center sm:gap-10 gap-5">
                        <h2 className="w-full text-3xl sm:text-4xl text-(--text-pink-color) text-center">
                            "Engage with the community through instant feedback
                            and live updates."
                        </h2>
                        <div className="p-3 px-10 rounded-4xl border-5 border-(--border-color2) hover:bg-(--tertiary-color) active:bg-(--tertiary-color) bg-(--quaternary-color)">
                            <NavLink
                                to={'/posts'}
                                className="hover:underline active:underline sm:text-lg"
                            >
                                Go to Posts →
                            </NavLink>
                        </div>
                    </div>
                    <div className="sm:w-1/2 w-full">
                        <div className="w-full flex justify-center items-center">
                            <img
                                className="sm:h-175 aspect-[16:9]"
                                src="/feat-comment.webp"
                                alt="post feature"
                            />
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="h-fit w-full border border-(--border-color) rounded-lg hover:bg-(--secondary-color) p-5 sm:p-10 flex flex-col gap-10"
                >
                    <div className="w-full flex flex-col items-center justify-center sm:gap-10 gap-5 p-5">
                        <h2 className="w-full text-3xl sm:text-4xl text-(--text-pink-color) text-center">
                            "Every update is automatically linked to your
                            precise location on the interactive map."
                        </h2>
                        <div className="p-3 px-10 rounded-4xl border-5 border-(--border-color2) hover:bg-(--tertiary-color) active:bg-(--tertiary-color) bg-(--quaternary-color)">
                            <NavLink
                                to={'/map'}
                                className="hover:underline active:underline sm:text-lg"
                            >
                                Go to Map →
                            </NavLink>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="w-full flex justify-center items-center sm:p-5">
                            <img
                                className="sm:block hidden sm:aspect-[16:9] aspect-[16:9]"
                                src="/feat-map.webp"
                                alt="post feature"
                            />
                            <img
                                className="block sm:hidden sm:aspect-[16:9] aspect-[16:9]"
                                src="/feat-map(phone).webp"
                                alt="post feature"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Cards;
