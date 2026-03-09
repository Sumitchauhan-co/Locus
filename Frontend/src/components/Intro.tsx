import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const text =
    'Here you can post your social life and get to see other people who are doing great in their life!';

export default function Intro() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const x = useTransform(scrollYProgress, [0, 1], ['30%', '-120%']);

    return (
        <section
            ref={sectionRef}
            className="relative h-[160vh]"
        >
            <div className="sticky top-0 h-1/2 flex items-center overflow-hidden">
                <motion.div
                    style={{ x }}
                    className="text-4xl md:text-6xl font-medium whitespace-nowrap"
                >
                    {text}
                </motion.div>
            </div>
        </section>
    );
}


