import React from 'react';
import ScrollToTop from '../components/ScrollToTop';

const About: React.FC = () => {
    return (
        <section className="min-h-screen w-full grid content-center">
            <ScrollToTop />
            <div className="text-center text-3xl sm:text-4xl font-[cursive]">
                <h1>This is my hooby + learning project for practise.</h1>
            </div>
        </section>
    );
};

export default About;
