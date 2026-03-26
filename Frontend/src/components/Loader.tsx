import { motion, type Variants } from 'framer-motion';
import { SiReactivex } from 'react-icons/si';

const MAX_TILES = 150;
const STATIC_RANDOM_POOL = Array.from(
    { length: MAX_TILES },
    () => Math.random() * 5,
);

export default function Loader({ onFinish }: { onFinish: () => void }) {
    const word = 'Locus'.split('');

    const container: Variants = {
        animate: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
    };

    const letter: Variants = {
        initial: { opacity: 0, y: 10 },
        animate: {
            opacity: [0, 1],
            y: [10, -10],
            transition: {
                duration: 2,
                times: [0, 0.2, 1],
                ease: 'easeInOut',
            },
        },
    };

    const tileVariants: Variants = {
        animate: (delay: number) => ({
            opacity: [0, 1, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                delay: delay,
                ease: 'easeInOut',
            },
        }),
    };

    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
            {/* 2. THE CSS-DRIVEN GRID (NO MORE JANKY FLASHES) */}
            <div
                className="absolute inset-0 grid w-full h-full opacity-20 
                        grid-cols-6 grid-rows-[repeat(15,1fr)] 
                        sm:grid-cols-10 md:grid-rows-[repeat(6,1fr)]"
            >
                {STATIC_RANDOM_POOL.map((delay, i) => (
                    <div
                        key={i}
                        className="relative border-[0.5px] border-white/5"
                    >
                        <motion.div
                            custom={delay}
                            variants={tileVariants}
                            animate="animate"
                            className="absolute inset-0 border-2 border-pink-500 bg-pink-500/5 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                        />
                    </div>
                ))}
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="text-pink-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]"
                >
                    <SiReactivex size={60} />
                </motion.div>

                <motion.div
                    variants={container}
                    initial="initial"
                    animate="animate"
                    onAnimationComplete={onFinish}
                    className="flex text-white text-4xl sm:text-5xl tracking-[0.3em] uppercase"
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
            </div>
        </div>
    );
}
