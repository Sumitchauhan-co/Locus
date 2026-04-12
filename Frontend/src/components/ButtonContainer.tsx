import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import Button from './Button';
import { Icons } from '../utils/icons';

const ButtonContainer: React.FC = () => {
    const [lucky, setLucky] = useState(false);

    const diceIcons = [
        Icons.oneFaceDie,
        Icons.twoFaceDie,
        Icons.threeFaceDie,
        Icons.fourFaceDie,
        Icons.fiveFaceDie,
        Icons.sixFaceDie,
    ];

    const [currentDiceIndex, setCurrentDiceIndex] = useState<number | null>(
        null,
    );

    const rollDice = () => {
        const randomIndex = Math.floor(Math.random() * diceIcons.length);
        setCurrentDiceIndex(randomIndex);
        setLucky(false);
        if (randomIndex === 5) {
            setLucky(true);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: [
                    '#ff0000',
                    '#ffa500',
                    '#ffff00',
                    '#008000',
                    '#0000ff',
                    '#4b0082',
                    '#ee82ee',
                ],
            });
        }
    };

    const SelectedIcon =
        currentDiceIndex !== null
            ? diceIcons[currentDiceIndex]
            : Icons.randomFaceDie;

    return (
        <section
            title="Click on a die"
            className="relative h-[25vh] grid content-center"
        >
            <div className="flex flex-col justify-between items-center gap-5 group">
                <Button className="font-semibold" />
                <motion.div
                    onClick={rollDice}
                    whileTap={{
                        rotate: 360,
                    }}
                    className="peer-hover:animate-bounce"
                >
                    <SelectedIcon
                        className={`${lucky ? 'fill-pink-300' : 'fill-white'} xl:h-20 xl:w-20 lg:h-17 lg:w-17 sm:h-15 sm:w-15 h-20 w-20`}
                    />
                </motion.div>
                <div className="text-2xl sm:text-3xl xl:text-4xl text-center">
                    <span>
                        {currentDiceIndex === 5 ? (
                            <div className="text-center">
                                <div>
                                    You won the{' '}
                                    <p className="inline text-pink-300">luck</p>
                                    ,
                                </div>
                                <p>Now create your post!</p>
                            </div>
                        ) : (
                            'Make your move!'
                        )}
                    </span>
                </div>
            </div>
        </section>
    );
};

export default ButtonContainer;
