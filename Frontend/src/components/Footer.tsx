import React from 'react';
import { SiReactivex } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
    const navigate = useNavigate();

    return (
        <footer className="h-fit w-full p-10 flex relative z-9999 bottom-0 bg-(--secondary-color)">
            <div className="w-1/2 flex justify-center items-center">
                <SiReactivex className="h-10 w-10" />
            </div>
            <div className="w-1/2 flex md:flex-row md:gap-0 gap-3 flex-col justify-around items-center">
                <span
                    onClick={() => navigate('/contact')}
                    className="cursor-pointer sm:text-[1rem] text-sm hover:underline text-center"
                >
                    Contact
                </span>
                <span
                    onClick={() => navigate('/')}
                    className="cursor-pointer sm:text-[1rem] text-sm hover:underline text-center"
                >
                    Privacy Policy
                </span>
                <span
                    onClick={() => navigate('/')}
                    className="cursor-pointer sm:text-[1rem] text-sm hover:underline text-center"
                >
                    Terms & Conditions
                </span>
            </div>
        </footer>
    );
};

export default Footer;
