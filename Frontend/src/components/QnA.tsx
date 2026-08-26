import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

interface FloatingPrompt {
	q: string;
	a: string;
	pos: string;
	rotation: number;
	floatOffset: number;
	duration: number;
	delay: number;
}

const floatingPrompts: FloatingPrompt[] = [
	{
		q: 'Got a thought?',
		a: 'Share it with everyone',
		pos: 'top-4 left-4 md:top-10 md:left-16',
		rotation: -6,
		floatOffset: 12,
		duration: 4.2,
		delay: 0,
	},
	{
		q: 'Curious?',
		a: 'Ask the community',
		pos: 'top-4 right-4 md:top-10 md:right-16',
		rotation: 8,
		floatOffset: 15,
		duration: 5.2,
		delay: 0.7,
	},
	{
		q: 'Building something?',
		a: 'Show off your progress',
		pos: 'bottom-4 left-4 md:bottom-10 md:left-16',
		rotation: 5,
		floatOffset: 10,
		duration: 4.8,
		delay: 1.1,
	},
	{
		q: 'Need feedback?',
		a: 'Start a discussion',
		pos: 'bottom-4 right-4 md:bottom-10 md:right-16',
		rotation: -9,
		floatOffset: 14,
		duration: 5.8,
		delay: 0.4,
	},
];

const QnA = () => {
	const [centerContent, setCenterContent] = useState({ q: '', a: '' });

	useEffect(() => {
		const centerPrompts = [
			{ q: 'Have something to say?', a: 'Your voice matters. Jump right in.' },
			{ q: 'What is on your mind?', a: 'Turn your thoughts into a topic.' },
			{ q: 'Ready to connect?', a: 'Spark a fresh conversation today.' },
		];
		const randomPair =
			centerPrompts[Math.floor(Math.random() * centerPrompts.length)];
		setCenterContent(randomPair);
	}, []);

	return (
		<section className="relative w-full min-h-[440px] md:min-h-[520px] flex items-center justify-center p-6 overflow-hidden rounded-3xl bg-neutral-950/40  backdrop-blur-md select-none">
			{/* Ambient Radial Background Glow */}
			<div className="absolute inset-0  pointer-events-none" />

			{/* Continuous Floating Corner Badges */}
			{floatingPrompts.map((item, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, y: 0, rotate: item.rotation }}
					animate={{
						opacity: 1,
						y: [-item.floatOffset, item.floatOffset, -item.floatOffset],
						rotate: [
							item.rotation - 1.5,
							item.rotation + 1.5,
							item.rotation - 1.5,
						],
					}}
					transition={{
						opacity: { duration: 0.6 },
						y: {
							duration: item.duration,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: item.delay,
						},
						rotate: {
							duration: item.duration * 1.2,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: item.delay,
						},
					}}
					whileHover={{
						scale: 1.1,
						rotate: 0,
						zIndex: 40,
						transition: { type: 'spring', stiffness: 300, damping: 15 },
					}}
					className={`absolute ${item.pos} z-10 cursor-pointer`}
				>
					<div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-neutral-900/80 border border-pink-500/20 shadow-lg shadow-pink-500/5 backdrop-blur-md hover:border-pink-500/60 hover:shadow-pink-500/25 transition-all duration-300">
						<span className="text-sm sm:text-base font-bold text-pink-400">
							{item.q}
						</span>
						<span className="text-[10px] sm:text-xs font-medium tracking-wide text-neutral-400 mt-1">
							{item.a}
						</span>
					</div>
				</motion.div>
			))}

			{/* Center Card & Main Action Button */}
			<div className="relative z-20 flex flex-col items-center text-center max-w-sm gap-6 p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800/80 shadow-2xl backdrop-blur-xl">
				<AnimatePresence mode="wait">
					<motion.div
						key={centerContent.q}
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.3 }}
						className="flex flex-col items-center gap-2"
					>
						<p className="text-2xl sm:text-3xl font-bold italic text-pink-400 bg-clip-text">
							{centerContent.q}
						</p>
						<p className="text-xs sm:text-sm font-medium tracking-wide text-neutral-300 opacity-90">
							{centerContent.a}
						</p>
					</motion.div>
				</AnimatePresence>

				<motion.div
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Button
						className="px-8 py-3.5 font-bold shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-shadow duration-300"
						text="Create Post"
					/>
				</motion.div>
			</div>
		</section>
	);
};

export default QnA;
