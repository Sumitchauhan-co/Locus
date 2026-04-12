import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Icons } from '../utils/icons';
import { useState, useEffect, useCallback, useMemo } from 'react';

const BALL_FREQ = 300; 
const FALL_DURATION = 7; 
const INTERACTION_WINDOW = 6000; 

const ROWS = 8; 
const COLS_DESKTOP = 10;
const COLS_MOBILE = 5;

const GRID_TILES = Array.from({ length: ROWS * COLS_DESKTOP }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    isVisible: Math.random() > 0.5, 
    column: i % COLS_DESKTOP,
}));

const HeartSVG = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor">
        <path d="M16 28.5L4.5 17C2.5 15 1 12.5 1 9.5 1 5 4.5 1.5 9 1.5c2.5 0 4.5 1 6 2.5 1.5-1.5 3.5-2.5 6-2.5 4.5 0 8 3.5 8 8 0 3-1.5 5.5-3.5 7.5L16 28.5z"/>
    </svg>
);

interface PopHeart {
    id: number;
    size: number;
    left: number;
    drift: number; 
    isPopped: boolean;
}

export default function Loader3({ onFinish }: { onFinish: () => void }) {
    const word = 'Locus'.split('');
    const [hearts, setHearts] = useState<PopHeart[]>([]);
    const [isTextDone, setIsTextDone] = useState(false);

    const container: Variants = useMemo(() => ({
        animate: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
    }), []);

    const letter: Variants = useMemo(() => ({
        initial: { opacity: 0, y: 10 },
        animate: {
            opacity: [0, 1],
            y: [15, -15],
            transition: { duration: 2, times: [0, 0.2, 1], ease: 'easeInOut' },
        },
    }), []);

    const tileVariants: Variants = useMemo(() => ({
        animate: (delay: number) => ({
            // INCREASED: Peak opacity is now 0.7 for better visibility
            opacity: [0.15, 0.7, 0.15], 
            scale: [0.98, 1.03, 0.98],
            transition: { duration: 3, repeat: Infinity, delay: delay, ease: 'easeInOut' },
        }),
    }), []);

    useEffect(() => {
        if (!isTextDone) return;
        const interval = setInterval(() => {
            const newHeart: PopHeart = {
                id: Math.random(),
                size: Math.random() * 15 + 25,
                left: Math.random() * 90 + 5,
                drift: Math.random() * 120, 
                isPopped: false,
            };
            setHearts((prev) => [...prev, newHeart]);
            setTimeout(() => {
                setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
            }, FALL_DURATION * 1000 + 500);
        }, BALL_FREQ);

        const finishTimer = setTimeout(onFinish, INTERACTION_WINDOW);
        return () => { clearInterval(interval); clearTimeout(finishTimer); };
    }, [isTextDone, onFinish]);

    const handlePop = useCallback((id: number) => {
        setHearts((prev) => prev.map((h) => (h.id === id ? { ...h, isPopped: true } : h)));
        setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== id)), 200);
    }, []);

    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black select-none touch-none font-sans">
            
            {/* LAYER 1: BRIGHTER PINK GRID BACKGROUND */}
            <AnimatePresence>
                {!isTextDone && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.8 } }}
                        className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center p-6"
                    >
                        <div 
                            className="grid gap-4 sm:gap-6 w-full max-w-6xl h-fit"
                            style={{ 
                                gridTemplateColumns: `repeat(${COLS_MOBILE}, 1fr)`,
                                gridTemplateRows: `repeat(${ROWS}, 1fr)`
                            }}
                        >
                            <style>{`
                                @media (min-width: 640px) {
                                    div[style*="grid-template-columns"] { 
                                        grid-template-columns: repeat(${COLS_DESKTOP}, 1fr) !important; 
                                    }
                                }
                            `}</style>
                            {GRID_TILES.map((tile) => (
                                <div key={tile.id} className={`relative aspect-square ${tile.column >= COLS_MOBILE ? 'hidden sm:block' : 'block'}`}>
                                    {tile.isVisible && (
                                        <motion.div
                                            custom={tile.delay}
                                            variants={tileVariants}
                                            animate="animate"
                                            // UPDATED: Stronger border (pink-500/50) and brighter shadow
                                            className="absolute inset-0 border-[2px] border-pink-500/50 bg-pink-500/10 rounded-sm shadow-[0_0_15px_rgba(236,72,153,0.25)]"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LAYER 2: INTERACTIVE COLORFUL HEARTS */}
            <div className="absolute inset-0 z-10 pointer-events-auto">
                <AnimatePresence>
                    {isTextDone && hearts.map((heart) => (
                        <motion.div
                            key={heart.id}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ 
                                scale: 1.6, 
                                opacity: 0, 
                                filter: 'brightness(1.2) blur(4px)', 
                                transition: { duration: 0.3, ease: "easeOut" } 
                            }}
                            onPointerDown={() => handlePop(heart.id)}
                            onPointerEnter={() => handlePop(heart.id)}
                            className="absolute flex items-center justify-center cursor-pointer"
                            style={{ 
                                width: '100px', height: '100px', 
                                left: `${heart.left}%`, 
                                y: `calc(-10vh + ${heart.drift}vh)`, 
                                transform: 'translateX(-50%)', 
                                touchAction: 'none',
                                transition: `y ${FALL_DURATION}s linear`,
                            }}
                        >
                            <motion.div
                                animate={{
                                    backgroundColor: heart.isPopped 
                                        ? ['#ff80c0', '#a855f7', '#3b82f6'] 
                                        : 'rgba(255, 45, 195, 0.1)',
                                    borderColor: heart.isPopped ? '#ffffff' : 'rgba(255, 128, 192, 0.5)',
                                    boxShadow: heart.isPopped 
                                        ? '0 0 30px 8px rgba(168, 85, 247, 0.5)' 
                                        : '0 0 12px 1px rgba(255, 128, 192, 0.2)',
                                    scale: heart.isPopped ? 1.25 : 1,
                                }}
                                className="rounded-full border-[1.5px] relative transition-all duration-150 flex items-center justify-center"
                                style={{
                                    width: heart.size, height: heart.size,
                                    color: heart.isPopped ? 'white' : '#ff80c0'
                                }}
                            >
                                <HeartSVG className="w-full h-full p-1.5" />
                                
                                {heart.isPopped && (
                                    <motion.div 
                                        initial={{ scale: 0.5, opacity: 1 }}
                                        animate={{ scale: 2.2, opacity: 0 }}
                                        className="absolute inset-0 border-2 border-pink-400 rounded-full"
                                    />
                                )}
                            </motion.div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* LAYER 3: CONTENT */}
            <div className="relative z-20 flex flex-col items-center gap-8 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="text-[#ff80c0] drop-shadow-[0_0_20px_rgba(255,128,192,0.8)]"
                >
                    <Icons.logo size={65} />
                </motion.div>
                
                <motion.div
                    variants={container}
                    initial="initial"
                    animate="animate"
                    onAnimationComplete={() => setTimeout(() => setIsTextDone(true), 500)}
                    className="flex text-white text-4xl sm:text-6xl tracking-[0.3em] uppercase drop-shadow-lg"
                >
                    {word.map((char, i) => (
                        <motion.span key={i} variants={letter}>{char}</motion.span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}