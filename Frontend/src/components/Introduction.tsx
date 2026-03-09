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

    const translateX = useTransform(scrollYProgress, [0, 1], ['20%', '-150%']);

    const progressIndex = useTransform(
        scrollYProgress,
        [0, 1],
        [0, words.length * 1.5],
    );

    const [currentWord, setCurrentWord] = useState<number>(0);

    useMotionValueEvent(progressIndex, 'change', (latest) => {
        setCurrentWord(Math.floor(latest));
    });

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.5, 0.9],
        [1, 1, 0],
    );

    return (
        <motion.section
            style={{ opacity }}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                type: spring,
                stiffness: 120,
                damping: 12,
            }}
            viewport={{ once: true, amount: 0.2 }}
            className="sm:py-25 py-15 sm:px-5 px-2"
        >
            <div className="sticky top-20 overflow-hidden flex justify-start items-center">
                <motion.div
                    style={{ x: translateX }}
                    className="lg:text-7xl bg-clip-text bg-gradient-to-t from-neutral-900 to-neutral-100 md:text-6xl x-sm:text-5xl text-4xl leading-relaxed font-medium whitespace-nowrap "
                >
                    {words.map((word, i) => (
                        <span
                            key={i}
                            className={`transition duration-500 ${
                                i <= currentWord
                                    ? 'text-white'
                                    : 'text-white/15'
                            }`}
                        >
                            {word}
                        </span>
                    ))}
                </motion.div>
            </div>

            <div
                className="h-[75vh] sm:h-[50vh]"
                ref={targetRef}
            />
        </motion.section>
    );
};

export default Introduction;
