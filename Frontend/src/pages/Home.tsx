import React, { useRef } from 'react';
import Introduction from '../components/Introduction';
import ButtonContainer from '../components/ButtonContainer';
import { Icons } from '../utils/icons';
import { ScrollToTop } from '../components/ScrollTo';
import Cards from '../components/Cards';

const Home: React.FC = () => {
    const targetRef = useRef<HTMLDivElement | null>(null);

    return (
        <section
            ref={targetRef}
            className="min-h-screen relative pt-20 pb-20"
        >
            <ScrollToTop />

            <div className="w-full grid content-center">
                <div className="text-4xl sm:text-5xl flex flex-col px-3 text-center">
                    <h1>New way to connect,</h1>
                    <h1> make friends!</h1>
                    <div className="relative">
                        <div className="absolute top-0 left-75">
                            <Icons.emoji1 className="flex h-5 w-5" />
                        </div>
                        <div className="absolute -top-25 left-85">
                            <Icons.emoji2 className="flex h-5 w-5" />
                        </div>
                        <div className="absolute -top-10 right-75">
                            <Icons.emoji3 className="flex h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center text-6xl sm:text-7xl my-15 font-sans">
                <h1 className="tracking-[0.2rem] sm:tracking-[0.3rem] font-[cursive] text-(--dark-pink-color)">
                    LOCUS
                </h1>
            </div>

            <Introduction />
            {/* <Intro/> */}
            <Cards />
            <ButtonContainer />
        </section>
    );
};

export default Home;
