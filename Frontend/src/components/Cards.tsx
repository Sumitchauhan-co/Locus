import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { useMediaQuery } from '@react-hook/media-query';
import { NavLink } from 'react-router-dom';
import Button from './Button';

const Cards: React.FC = () => {
    const isDesktop = useMediaQuery('(min-width: 640px)');

    const cards = [
        {
            id: 1,
            heading: `"Full support for high-resolution imagery and dynamic text layouts."`,
            btnText: `Go to Posts →`,
            imgSrc: `/feat-post.webp`,
            imgSrcPhone: `/feat-post.webp`,

            alt: `Post feature`,
        },
        {
            id: 2,
            heading: `"Engage with the community through instant feedback
                            and live updates."`,
            btnText: `Go to Posts →`,
            imgSrc: `/feat-comment.webp`,
            imgSrcPhone: `/feat-comment.webp`,

            alt: `Post feature`,
        },
        {
            id: 3,
            heading: `"Every update is automatically linked to your
                            precise location on the interactive map."`,
            btnText: `Go to Map →`,
            imgSrc: `/feat-map.webp`,
            imgSrcPhone: `/feat-map(phone).webp`,
            alt: `Map feature`,
        },
    ];

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
        <section className="h-fit w-full flex flex-col gap-10">
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
                <h2 className="text-transparent bg-clip-text bg-gradient-to-t from-neutral-400 to-white">
                    Share your journey instantly
                </h2>
                <div className="h-full flex justify-center items-center">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: isDesktop ? 800 : 300 }}
                        transition={{ duration: 1 }}
                        className="h-1 bg-pink-500 rounded-full"
                    ></motion.div>
                </div>
            </motion.div>
            <div className="h-fit w-full flex flex-col p-5 gap-10 md:gap-25 mt-15 sm:mt-25">
                {cards.map((card) => (
                    <motion.div
                        key={card.id}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        className={`${card.id === 3 ? '' : 'md:flex-row'} h-fit w-full border border-(--border-color) rounded-lg hover:bg-(--secondary-color) p-5 md:p-10 flex flex-col gap-10`}
                    >
                        <div
                            className={`${card.id === 3 ? 'w-full' : 'md:w-1/2 '} flex flex-col items-center justify-center md:gap-10 gap-5`}
                        >
                            <h2 className="w-full text-3xl md:text-4xl text-(--text-pink-color)/75 text-center">
                                {card.heading}
                            </h2>
                            <NavLink to={`${card.id === 3? '/Map': '/Post'}`}>
                                <Button
                                    text={card.btnText}
                                />
                            </NavLink>
                        </div>
                        <div
                            className={`${card.id === 3 ? 'w-full' : 'md:w-1/2'} w-full`}
                        >
                            <div className="w-full flex justify-center items-center">
                                <img
                                    className="md:block hidden aspect-[16:9] brightness-90"
                                    src={card.imgSrc}
                                    alt={card.alt}
                                    loading="lazy"
                                    height={700}
                                    width={`${card.id === 3 ? 850 : 350}`}
                                />
                                <img
                                    className="block md:hidden aspect-2/3"
                                    src={card.imgSrcPhone}
                                    alt={card.alt}
                                    loading="lazy"
                                    height={700}
                                    width={300}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
                
            </div>
        </section>
    );
};

export default Cards;
