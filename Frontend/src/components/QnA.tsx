import { useState, useEffect } from 'react';
import Button from './Button';

const QnA = () => {
    const prompts = [
        {
            q: 'Why?',
            a: 'Scroll to find out!',
            // Adjusted for mobile (closer to center) vs desktop
            pos: 'top-5 left-5 md:top-20 md:left-32 -rotate-12',
        },
        {
            q: 'Stuck?',
            a: "We've got the fix.",
            pos: 'top-5 right-5 md:top-20 md:right-32 rotate-12',
        },
        {
            q: 'Ideas?',
            a: "Let 'em out!",
            pos: 'bottom-5 left-5 md:bottom-20 md:left-32 rotate-6',
        },
        {
            q: 'Lost?',
            a: 'Follow the thread.',
            pos: 'bottom-5 right-5 md:bottom-20 md:right-32 -rotate-15',
        },
    ];

    const [content, setContent] = useState({ q: '', a: '' });

    useEffect(() => {
        const fn = () => {
            const extras = [
                { q: 'Expert?', a: 'Drop some knowledge!' },
                { q: 'Thinking?', a: 'Type it out.' },
                { q: 'Help?', a: 'The community is here.' },
            ];
            const randomPair =
                extras[Math.floor(Math.random() * extras.length)];
            setContent(randomPair);
        };

        fn();
    }, []);

    return (
        <div className="relative group p-5 transition-all duration-300 ease-in-out overflow-hidden">
            {prompts.map((item, index) => (
                <div
                    key={index}
                    // Removed 'hidden' so it shows on mobile, kept absolute positioning
                    className={`flex absolute ${item.pos} justify-center items-center flex-col gap-1 md:gap-2 text-(--primary-color) font-bold pointer-events-none z-10`}
                >
                    <p className="text-lg md:text-2xl group-hover:rotate-0 group-hover:scale-110 sm:group-hover:text-neutral-500 text-neutral-500 transition-all duration-500">
                        {item.q}
                    </p>
                    <p className="text-[10px] md:text-xs tracking-widest uppercase opacity-70 sm:group-hover:text-neutral-700 text-neutral-700 transition-colors duration-500">
                        {item.a}
                    </p>
                </div>
            ))}

            {/* Featured content remains desktop-only to avoid cluttering small mobile screens */}
            <div className="p-5 md:flex absolute hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-40 justify-center items-center flex-col gap-2 text-(--primary-color) font-bold pointer-events-none z-10">
                <p className="text-3xl italic group-hover:text-neutral-500 transition-all duration-500">
                    {content.q}
                </p>
                <p className="text-sm tracking-tighter opacity-80 group-hover:text-neutral-700">
                    {content.a}
                </p>
            </div>

            <div className="w-full py-20 md:py-30 flex justify-center items-center border-dotted group-hover:border-dotted group-hover:border-neutral-400 border-(--primary-color) transition-all duration-300">
                <Button
                    className="px-10 py-4 transform group-hover:scale-105 transition-transform"
                    text="Create Post"
                />
            </div>
        </div>
    );
};

export default QnA;
