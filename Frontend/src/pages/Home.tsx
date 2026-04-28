import React, { useRef } from 'react';
import Introduction from '../components/Introduction';
import ButtonContainer from '../components/ButtonContainer';
import { ScrollToTop } from '../components/ScrollTo';
import Cards from '../components/Cards';
import QnA from '../components/QnA';
import Intro from '../components/Intro';

const Home: React.FC = () => {
    const targetRef = useRef<HTMLDivElement | null>(null);

    return (
        <section
            ref={targetRef}
            className="min-h-screen relative pt-20 pb-20"
        >
            <ScrollToTop />

            <Intro />
            <QnA />

            <Introduction />
            {/* <Intro/> */}
            <Cards />
            <ButtonContainer />
        </section>
    );
};

export default Home;
