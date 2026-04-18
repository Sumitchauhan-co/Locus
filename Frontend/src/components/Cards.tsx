import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { useMediaQuery } from '@react-hook/media-query';
import { NavLink } from 'react-router-dom';

const Cards: React.FC = () => {
    const isDesktop = useMediaQuery('(min-width: 640px)');

    const cardVariants: Variants = {
        hidden: {
            y: 50,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 1,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section className="h-fit w-full flex flex-col my-50 gap-10">
            <motion.div
                initial={{ y: 75, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 12,
                    duration: 1,
                }}
                className="text-5xl md:text-6xl flex flex-col gap-3 text-center"
            >
                <h2>Share your journey instantly</h2>
                <div className="h-full flex justify-center items-center">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: isDesktop ? 800 : 300 }}
                        transition={{ duration: 1 }}
                        className="h-1 bg-pink-500 rounded-full"
                    ></motion.div>
                </div>
            </motion.div>
            <div className="h-fit w-full flex flex-col p-5 md:mt-25 mt-15 gap-10 md:gap-25">
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    className="h-fit w-full border border-(--border-color) rounded-lg hover:bg-(--secondary-color) p-5 md:p-10 flex md:flex-row flex-col gap-10"
                >
                    <div className="md:w-1/2 w-full flex flex-col items-center justify-center md:gap-10 gap-5">
                        <h2 className="w-full text-3xl md:text-4xl text-(--text-pink-color) text-center">
                            "Full support for high-resolution imagery and
                            dynamic text layouts."
                        </h2>
                        <div className="md:p-3 p-2 md:px-10 px-7 rounded-4xl border-5 border-(--border-color2) hover:bg-(--tertiary-color) active:bg-(--tertiary-color) bg-(--quaternary-color)">
                            <NavLink
                                to={'/posts'}
                                className="hover:underline active:underline md:text-lg"
                            >
                                Go to Posts →
                            </NavLink>
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full">
                        <div className="w-full flex justify-center items-center">
                            <img
                                className="lg:h-175 md:h-150 aspect-[16:9]"
                                src="/feat-post.webp"
                                alt="post feature"
                                loading="lazy"
                                height={700}
                                width={400}
                            />
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    className="h-fit w-full border border-(--border-color) rounded-lg hover:bg-(--secondary-color) p-5 md:p-10 flex md:flex-row flex-col gap-10"
                >
                    <div className="md:w-1/2 w-full flex flex-col justify-center items-center md:gap-10 gap-5">
                        <h2 className="w-full text-3xl md:text-4xl text-(--text-pink-color) text-center">
                            "Engage with the community through instant feedback
                            and live updates."
                        </h2>
                        <div className="p-3 px-10 rounded-4xl border-5 border-(--border-color2) hover:bg-(--tertiary-color) active:bg-(--tertiary-color) bg-(--quaternary-color)">
                            <NavLink
                                to={'/posts'}
                                className="hover:underline active:underline md:text-lg"
                            >
                                Go to Posts →
                            </NavLink>
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full">
                        <div className="w-full flex justify-center items-center">
                            <img
                                className="lg:h-175 md:h-150 aspect-[16:9]"
                                src="/feat-comment.webp"
                                alt="post feature"
                                loading="lazy"
                                height={700}
                                width={400}
                            />
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    className="h-fit w-full border border-(--border-color) rounded-lg hover:bg-(--secondary-color) p-5 md:p-10 flex flex-col gap-10"
                >
                    <div className="w-full flex flex-col items-center justify-center md:gap-10 gap-5 p-5">
                        <h2 className="w-full text-3xl md:text-4xl text-(--text-pink-color) text-center">
                            "Every update is automatically linked to your
                            precise location on the interactive map."
                        </h2>
                        <div className="p-3 px-10 rounded-4xl border-5 border-(--border-color2) hover:bg-(--tertiary-color) active:bg-(--tertiary-color) bg-(--quaternary-color)">
                            <NavLink
                                to={'/map'}
                                className="hover:underline active:underline md:text-lg"
                            >
                                Go to Map →
                            </NavLink>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="w-full flex justify-center items-center md:p-5">
                            <img
                                className="md:block hidden md:aspect-[16:9] aspect-[16:9]"
                                src="/feat-map.webp"
                                alt="post feature"
                                loading="lazy"
                                height={700}
                                width={1000}
                            />
                            <img
                                className="block md:hidden md:aspect-[16:9] aspect-[16:9]"
                                src="/feat-map(phone).webp"
                                alt="post feature"
                                loading="lazy"
                                height={700}
                                width={400}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Cards;
