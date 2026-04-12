import React, { useState } from 'react';
import { ScrollToTop } from '../components/ScrollTo';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../utils/icons';

const faqData = [
    {
        question: 'What is Locus?',
        answer: `Locus is the post sharing website, where you can find the posts shared by users and their location to connect.`,
    },
    {
        question: 'Who is the developer of this project?',
        answer: `Sumit Chauhan (https://github.com/Sumitchauhan-co)`,
    },
    {
        question: 'How can I collaborate?',
        answer: 'Reach out via the contact section for project inquiries.',
    },
];

const About: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="min-h-screen w-full p-3 sm:p-10">
            <ScrollToTop />

            <div className="h-full w-full flex flex-col justify-around items-center gap-10">
                <h2 className="text-4xl sm:text-5xl text-center">FAQs</h2>
                <div className="w-full flex flex-col justify-center items-center">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className={`w-full xl:w-[60%] lg:w-[70%] x-sm:w-[90%] md:w-[80%]  ${index % 2 == 0 ? 'bg-neutral-700/50' : 'bg-neutral-800/50'} border rounded-2xl px-5 mb-7`}
                        >
                            <button type='button'
                                onClick={() => toggleFAQ(index)}
                                className="w-full text-left flex justify-between items-center py-2 focus:outline-none"
                            >
                                <span className="font-medium text-[1rem] sm:text-lg">
                                    {item.question}
                                </span>
                                <span>{activeIndex === index ? (<Icons.cross className='transition-all duration-300'/>) : (<Icons.cross className='rotate-45 transition-all duration-300'/>)}</span>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p
                                            className="py-2 text-neutral-400 italic text-[1rem] sm:text-lg"
                                        >
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
