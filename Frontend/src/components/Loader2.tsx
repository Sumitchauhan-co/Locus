import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { SiReactivex } from 'react-icons/si';
import { useState, useEffect, useCallback, useMemo } from 'react';

const BALL_FREQ = 250; 
const FALL_DURATION = 6; 
const INTERACTION_WINDOW = 6000; 

interface Ball {
    id: number;
    size: number;
    left: number;
    isPopped: boolean;
}

export default function Loader2({ onFinish }: { onFinish: () => void }) {
    const word = 'Locus'.split('');
    const [balls, setBalls] = useState<Ball[]>([]);
    const [isTextDone, setIsTextDone] = useState(false);

    // 1. Memoized Variants
    const container: Variants = useMemo(() => ({
        animate: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
    }), []);

    const letter: Variants = useMemo(() => ({
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
    }), []);

    // 2. Logic for Fresh Ball Stream
    useEffect(() => {
        if (!isTextDone) return;

        const interval = setInterval(() => {
            const newBall: Ball = {
                id: Math.random(),
                size: Math.random() * 20 + 25, 
                left: Math.random() * 90 + 5,
                isPopped: false,
            };
            setBalls((prev) => [...prev, newBall]);

            setTimeout(() => {
                setBalls((prev) => prev.filter(b => b.id !== newBall.id));
            }, FALL_DURATION * 1000 + 500);
        }, BALL_FREQ);

        const finishTimer = setTimeout(() => {
            onFinish();
        }, INTERACTION_WINDOW);

        return () => {
            clearInterval(interval);
            clearTimeout(finishTimer);
        };
    }, [isTextDone, onFinish]);

    const handlePop = useCallback((id: number) => {
        setBalls((prev) => 
            prev.map(b => b.id === id ? { ...b, isPopped: true } : b)
        );
        setTimeout(() => {
            setBalls((prev) => prev.filter((b) => b.id !== id));
        }, 150);
    }, []);

    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black select-none touch-none">
            
            {/* Interactive Pink Background */}
            <div className="absolute inset-0 z-0 pointer-events-auto">
                <AnimatePresence>
                    {isTextDone && balls.map((ball) => (
                        <motion.div
                            key={ball.id}
                            initial={{ y: '-10vh', opacity: 0 }}
                            animate={{ y: '110vh', opacity: 1 }}
                            exit={{ 
                                scale: 1.5, 
                                opacity: 0, 
                                filter: 'brightness(5) blur(15px)',
                                transition: { duration: 0.3 } 
                            }}
                            transition={{ 
                                y: { duration: FALL_DURATION, ease: 'linear' },
                                opacity: { duration: 0.4 }
                            }}
                            onPointerDown={() => handlePop(ball.id)}
                            onPointerEnter={() => handlePop(ball.id)}
                            className="absolute flex items-center justify-center cursor-pointer"
                            style={{
                                width: '100px', 
                                height: '100px',
                                left: `${ball.left}%`,
                                transform: 'translateX(-50%)',
                                touchAction: 'none'
                            }}
                        >
                            {/* CLEAN SPHERE: Removed the inner div "dot" */}
                            <motion.div 
                                animate={{
                                    backgroundColor: ball.isPopped ? '#db2777' : 'rgba(219, 39, 119, 0.05)',
                                    borderColor: ball.isPopped ? '#fbcfe8' : 'rgba(236, 72, 153, 0.5)',
                                    boxShadow: ball.isPopped 
                                        ? '0 0 36px 12px rgba(236, 72, 153, 1)' 
                                        : '0 0 15px 2px rgba(236, 72, 153, 0.2)',
                                    scale: ball.isPopped ? 1.5 : 1
                                }}
                                className="rounded-full border-[1.5px] relative transition-all duration-75"
                                style={{
                                    width: ball.size,
                                    height: ball.size,
                                    // Kept the radial highlight for depth
                                    background: !ball.isPopped ? 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 75%)' : ''
                                }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center gap-8 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.9)]"
                >
                    <SiReactivex size={60} />
                </motion.div>

                <motion.div
                    variants={container}
                    initial="initial"
                    animate="animate"
                    onAnimationComplete={() => setIsTextDone(true)}
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