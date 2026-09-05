import { motion } from 'framer-motion';

interface LoadingBarProps {
	isLoading: boolean;
	onComplete?: () => void;
	className?: string;
}

export default function LoadingBar({
	isLoading,
	onComplete,
	className = '',
}: LoadingBarProps) {
	return (
		<div
			className={`w-48 sm:w-64 h-1.5 bg-pink-950/40 border border-pink-500/20 rounded-full overflow-hidden backdrop-blur-sm shadow-[0_0_10px_rgba(236,72,153,0.15)] ${className}`}
		>
			<motion.div
				className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-300 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.8)]"
				initial={{ width: '0%' }}
				animate={{ width: isLoading ? '85%' : '100%' }}
				transition={{
					duration: isLoading ? 8 : 0.25, // Smooth crawl while backend loads, fast snap when done
					ease: isLoading ? [0.1, 0.05, 0.2, 1] : 'easeOut',
				}}
				onAnimationComplete={() => {
					// Fires naturally when Framer Motion finishes animating to 100%
					if (!isLoading && onComplete) {
						onComplete();
					}
				}}
			/>
		</div>
	);
}
