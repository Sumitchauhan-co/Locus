import { motion, type Variants } from 'framer-motion';

export default function Loader({ onFinish }: { onFinish: () => void }) {
    const word = 'Posto'.split('');

    const container: Variants = {
        animate: {
            transition: {
                staggerChildren: 0.25,
                staggerDirection: -1,
                repeatDelay: 0.5,
            },
        },
    };

    const letter: Variants = {
        initial: { opacity: 1, y: 0 },
        animate: {
            opacity: [1, 1, 0],
            y: [0, 0, -10],
            transition: {
                duration: 1.2,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <motion.div
            variants={container}
            initial="initial"
            animate="animate"
            onAnimationComplete={onFinish}
            className="flex text-white text-4xl italic font-semibold"
        >
            {word.map((char, i) => (
                <motion.span
                    key={i}
                    variants={letter}
                >
                    {char}
                </motion.span>
            ))}
        </motion.div>
    );
}
