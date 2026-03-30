import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { SiReactivex } from 'react-icons/si';
import { useState, useEffect, useCallback, useMemo } from 'react';

const BALL_FREQ = 250; 
const FALL_DURATION = 6; 
const INTERACTION_WINDOW = 6000; 

// Increase pool size to handle the higher column count
const MAX_TILES = 200; 
const STATIC_TILE_DATA = Array.from({ length: MAX_TILES }, () => ({
    delay: Math.random() * 5,
    isVisible: Math.random() > 0.65, 
}));

interface Ball {
    id: number;
    size: number;
    left: number;
    isPopped: boolean;
}

export default function Loader3({ onFinish }: { onFinish: () => void }) {
    const word = 'Locus'.split('');
    const [balls, setBalls] = useState<Ball[]>([]);
    const [isTextDone, setIsTextDone] = useState(false);

    const container: Variants = useMemo(() => ({
        animate: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
    }), []);

    const letter: Variants = useMemo(() => ({
        initial: { opacity: 0, y: 10 },
        animate: {
            opacity: [0, 1],
            y: [10, -10],
            transition: { duration: 2, times: [0, 0.2, 1], ease: 'easeInOut' },
        },
    }), []);

    const tileVariants: Variants = useMemo(() => ({
        animate: (delay: number) => ({
            opacity: [0, 0.7, 0], 
            transition: {
                duration: 2.2,
                repeat: Infinity,
                delay: delay,
                ease: 'easeInOut',
            },
        }),
    }), []);

    useEffect(() => {
        if (!isTextDone) return;
        const interval = setInterval(() => {
            const newBall: Ball = {
                id: Math.random(),
                size: Math.random() * 18 + 22, 
                left: Math.random() * 92 + 4,
                isPopped: false,
            };
            setBalls((prev) => [...prev, newBall]);
            setTimeout(() => {
                setBalls((prev) => prev.filter(b => b.id !== newBall.id));
            }, FALL_DURATION * 1000 + 500);
        }, BALL_FREQ);

        const finishTimer = setTimeout(() => onFinish(), INTERACTION_WINDOW);
        return () => { clearInterval(interval); clearTimeout(finishTimer); };
    }, [isTextDone, onFinish]);

    const handlePop = useCallback((id: number) => {
        setBalls((prev) => prev.map(b => b.id === id ? { ...b, isPopped: true } : b));
        setTimeout(() => setBalls((prev) => prev.filter((b) => b.id !== id)), 150);
    }, []);

    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black select-none touch-none">
            
            {/* LAYER 1: TAILWIND-OPTIMIZED GRID */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden p-1">
                <div className="grid w-full h-full 
                    grid-cols-5 sm:grid-cols-10 lg:grid-cols-15 
                    gap-1 sm:gap-2 auto-rows-fr">
                    {STATIC_TILE_DATA.map((tile, i) => (
                        <div key={i} className="relative aspect-square">
                            {tile.isVisible && (
                                <motion.div
                                    custom={tile.delay}
                                    variants={tileVariants}
                                    initial={{ opacity: 0 }}
                                    animate="animate"
                                    className="absolute inset-0 border-[1px] border-pink-500/40 sm:border-pink-500/60 bg-pink-500/10 sm:bg-pink-500/15 rounded-[2px]"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* LAYER 2: INTERACTIVE BUBBLES */}
            <div className="absolute inset-0 z-10 pointer-events-auto">
                <AnimatePresence>
                    {isTextDone && balls.map((ball) => (
                        <motion.div
                            key={ball.id}
                            initial={{ y: '-10vh', opacity: 0 }}
                            animate={{ y: '110vh', opacity: 1 }}
                            exit={{ scale: 3, opacity: 0, filter: 'brightness(5) blur(15px)', transition: { duration: 0.3 } }}
                            transition={{ y: { duration: FALL_DURATION, ease: 'linear' }, opacity: { duration: 0.4 } }}
                            onPointerDown={() => handlePop(ball.id)}
                            onPointerEnter={() => handlePop(ball.id)}
                            className="absolute flex items-center justify-center cursor-pointer"
                            style={{ width: '70px', height: '70px', left: `${ball.left}%`, transform: 'translateX(-50%)', touchAction: 'none' }}
                        >
                            <motion.div 
                                animate={{
                                    backgroundColor: ball.isPopped ? '#db2777' : 'rgba(219, 39, 119, 0.05)',
                                    borderColor: ball.isPopped ? '#fbcfe8' : 'rgba(236, 72, 153, 0.6)',
                                    boxShadow: ball.isPopped ? '0 0 40px 10px rgba(236, 72, 153, 1)' : '0 0 8px 1px rgba(236,72,153,0.15)',
                                    scale: ball.isPopped ? 1.4 : 1
                                }}
                                className="rounded-full border-[1.5px] transition-all duration-75"
                                style={{
                                    width: ball.size, height: ball.size,
                                    background: !ball.isPopped ? 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 85%)' : ''
                                }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* LAYER 3: LOGO & TEXT */}
            <div className="relative z-20 flex flex-col items-center gap-6 sm:gap-8 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]"
                >
                    <SiReactivex size={48} className="sm:w-[60px] sm:h-[60px]" />
                </motion.div>

                <motion.div
                    variants={container}
                    initial="initial"
                    animate="animate"
                    onAnimationComplete={() => setIsTextDone(true)}
                    className="flex text-white text-3xl sm:text-5xl tracking-[0.25em] sm:tracking-[0.4em] uppercase font-light"
                >
                    {word.map((char, i) => (
                        <motion.span key={i} variants={letter}>{char}</motion.span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}