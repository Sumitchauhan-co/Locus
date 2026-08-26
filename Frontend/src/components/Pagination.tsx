import React from 'react';
import { motion } from 'framer-motion';

interface PaginationProps {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
	page,
	totalPages,
	onPageChange,
}) => {
	if (totalPages <= 1) return null;

	return (
		<nav
			aria-label="Posts pagination"
			className="flex items-center justify-center gap-3 px-4 py-8 text-sm text-(--text-color2)"
		>
			<motion.button
				type="button"
				whileTap={{ scale: 0.95 }}
				disabled={page === 1}
				onClick={() => onPageChange(page - 1)}
				className="rounded-lg border border-(--border-color2) px-4 py-2 transition-colors hover:border-pink-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
			>
				Previous
			</motion.button>
			<span className="min-w-20 text-center text-white">
				{page} / {totalPages}
			</span>
			<motion.button
				type="button"
				whileTap={{ scale: 0.95 }}
				disabled={page === totalPages}
				onClick={() => onPageChange(page + 1)}
				className="rounded-lg border border-(--border-color2) px-4 py-2 transition-colors hover:border-pink-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
			>
				Next
			</motion.button>
		</nav>
	);
};

export default Pagination;
