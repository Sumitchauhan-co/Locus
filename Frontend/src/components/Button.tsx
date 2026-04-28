import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
    className?: string;
    text?: string;
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
                'font-semibold px-7 py-3 text-sm sm:text-lg bg-(--button-color) hover:bg-(--button-hover-color) rounded-4xl lg:rounded-4xl sm:rounded-3xl outline-none text-black',
                className,
            )}
            {...props}
        >
            <span className='sm:text-lg text-sm font-[tahoma]'>{props.text}</span>
        </motion.button>
    );
};

export default Button;
