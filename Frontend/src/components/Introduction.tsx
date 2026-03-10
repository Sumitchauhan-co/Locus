import {
    useScroll,
    useTransform,
    motion,
    useMotionValueEvent,
    spring,
} from 'framer-motion';
import React, { useRef, useState } from 'react';

const text = 'Here, you can post your social life and get to see others!';
const words = text.split('');

const Introduction: React.FC = () => {
    const targetRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start end', 'end start'],
    });

    const translateX = useTransform(scrollYProgress, [0, 1], ['50%', '-125%']);

    const progressIndex = useTransform(
        scrollYProgress,
        [0, 1],
        [0, words.length * 1],
    );

    const [currentWord, setCurrentWord] = useState<number>(0);

    useMotionValueEvent(progressIndex, 'change', (latest) => {
        setCurrentWord(Math.floor(latest));
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5, 0.9], [1, 0.9, 0.5]);

    return (
        <motion.section
            style={{ opacity }}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                type: spring,
                stiffness: 160,
                damping: 8,
            }}
            viewport={{ once: true, amount: 0.2 }}
            className="sm:py-25 mb-20 sm:px-5 px-2"
        >
            <div className="sticky top-20 overflow-hidden flex justify-start items-center">
                <motion.div
                    style={{ x: translateX }}
                    className="text-center bg-clip-text bg-gradient-to-t from-neutral-950 to-neutral-50 text-7xl sm:text-8xl leading-relaxed font-medium whitespace-nowrap "
                >
                    {words.map((word, i) => (
                        <span
                            key={i}
                            className={`transition duration-300 font-[sans-serif] ${
                                i <= currentWord
                                    ? 'text-(--text-pink-color)'
                                    : 'text-(--text-pink-color2)'
                            }`}
                        >
                            {word}
                        </span>
                    ))}
                </motion.div>
            </div>

            <div
                className="h-[125vh] scroll-smooth"
                ref={targetRef}
            />
        </motion.section>
    );
};

export default Introduction;
