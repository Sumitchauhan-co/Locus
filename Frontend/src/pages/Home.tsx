import React, { useRef } from 'react';
import Introduction from '../components/Introduction';
import ButtonContainer from '../components/ButtonContainer';
import { BsEmojiGrin } from 'react-icons/bs';
import { BsEmojiHeartEyes } from 'react-icons/bs';
import { BsEmojiSunglasses } from 'react-icons/bs';
import ScrollToTop from '../components/ScrollToTop';
import { FaArrowAltCircleDown } from 'react-icons/fa';
import { useScroll, useTransform, motion } from 'framer-motion';

const Home: React.FC = () => {
    const targetRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start end', 'end start'],
    });
    const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

    return (
        <section
            ref={targetRef}
            className="min-h-screen relative pt-20 pb-20"
        >
            <ScrollToTop />

            <div className="w-full grid content-center">
                <div className="text-4xl sm:text-5xl flex flex-col px-3 font-[tahoma] text-center">
                    <h1>New way to connect,</h1>
                    <h1> make friends!</h1>
                    <div className="relative">
                        <div className="absolute top-0 left-75">
                            <BsEmojiGrin className="hidden sm:flex h-5 w-5" />
                        </div>
                        <div className="absolute -top-27 left-85">
                            <BsEmojiHeartEyes className="hidden sm:flex h-5 w-5" />
                        </div>
                        <div className="absolute -top-12 right-75">
                            <BsEmojiSunglasses className="hidden sm:flex h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center text-6xl sm:text-7xl my-15 font-sans">
                <h1 className="font-[cursive] text-pink-500">Posto</h1>
            </div>

            <Introduction />
            {/* <Intro/> */}
            <ButtonContainer />
            <motion.div
                style={{ opacity }}
                className="w-full sticky flex flex-col justify-center items-center bottom-0"
            >
                <span>Scroll down</span>
                <div className="h-10 w-10 flex justify-center items-center">
                    <FaArrowAltCircleDown className="h-7 w-7 animate-bounce"></FaArrowAltCircleDown>
                </div>
            </motion.div>
        </section>
    );
};

export default Home;
