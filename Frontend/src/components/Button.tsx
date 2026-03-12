import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ className, ...props }) => {
    const navigate = useNavigate();
    return (
        <motion.button
            onClick={() => navigate('/create-post')}
            whileTap={{
                scale: 0.95,
            }}
            whileHover={{
                scale: 1.05,
            }}
            type="button"
            className={twMerge(
                'h-12 w-40 sm:h-12 sm:w-36 text-sm sm:text-lg bg-(--button-color) hover:bg-(--button-hover-color) rounded-4xl lg:rounded-4xl sm:rounded-3xl outline-none text-black font-[tahoma]',
                className,
            )}
            {...props}
        >
            <span className=' text-lg sm:text-[1rem] lg:text-lg'>Create Post</span>
        </motion.button>
    );
};

export default Button;
