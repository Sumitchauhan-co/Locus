import {
    useScroll,
    useTransform,
    motion,
    useMotionValueEvent,
} from 'framer-motion';
import React, { useRef, useState } from 'react';

const text = 'The central point where your moments meet the map. Pin your life to the world and discover the social pulse of every place.';
const words = text.split('');

const Introduction: React.FC = () => {
    const targetRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start end', 'end start'],
    });

    const translateX = useTransform(scrollYProgress, [0, 1], ['90%', '-90%']);

    const progressIndex = useTransform(
        scrollYProgress,
        [0, 1],
        [0, words.length * 1],
    );

    const [currentWord, setCurrentWord] = useState<number>(0);

    useMotionValueEvent(progressIndex, 'change', (latest) => {
        setCurrentWord(Math.floor(latest));
    });

    const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.75]);

    // 1. Syncing the line perfectly with the text movement range
    // We adjust the range to [0.1, 0.9] so it doesn't move while the section is just entering the view
    const lineSync = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);
    const headPosition = useTransform(lineSync, [0, 1], ['0%', '100%']);

    return (
        <motion.section
            style={{ opacity }}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                mass: 1,
                delay: 0.2,
            }}
            ref={targetRef}
            viewport={{ once: true, amount: 0.2 }}
            className="h-[375vh] sm:py-25 sm:px-5 px-2"
        >
            <div className="sticky h-screen top-0 overflow-hidden flex flex-col justify-center items-center">
                <motion.div
                    style={{ x: translateX }}
                    className="text-center text-7xl sm:text-8xl leading-relaxed font-medium whitespace-nowrap "
                >
                    {words.map((word, i) => (
                        <span
                            key={i}
                            className={`transition duration-300 font-[sans-serif] tracking-[0.5rem] italic ${
                                i <= currentWord
                                    ? 'text-(--text-pink-color)'
                                    : 'text-(--text-pink-color2)'
                            }`}
                        >
                            {word}
                        </span>
                    ))}
                </motion.div>

                <div className="relative w-full max-w-3xl mt-24 px-4">
                    
                    <div className="relative h-[2px] w-full bg-pink-500/10 rounded-full">
                        
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-4 w-2 h-2 rounded-full border border-pink-500/50" />

                        <motion.div 
                            style={{ scaleX: lineSync, transformOrigin: "left" }}
                            className="absolute inset-0 h-full bg-pink-500 shadow-[0_0_8px_#ec4899]"
                        />

                        <motion.div 
                            style={{ left: headPosition }}
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                        >
                            <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_12px_#ec4899] border-2 border-pink-500" />
                        </motion.div>

                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-4 w-2 h-2 rounded-full border border-pink-500/50" />
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default Introduction;