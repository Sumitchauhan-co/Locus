import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
    GiPerspectiveDiceSixFacesRandom,
    GiPerspectiveDiceSixFacesOne,
    GiPerspectiveDiceSixFacesTwo,
    GiPerspectiveDiceSixFacesThree,
    GiPerspectiveDiceSixFacesFour,
    GiPerspectiveDiceSixFacesFive,
    GiPerspectiveDiceSixFacesSix,
} from 'react-icons/gi';
import {} from 'react-icons/gi';
import Button from './Button';

const ButtonContainer: React.FC = () => {
    const diceIcons = [
        GiPerspectiveDiceSixFacesOne,
        GiPerspectiveDiceSixFacesTwo,
        GiPerspectiveDiceSixFacesThree,
        GiPerspectiveDiceSixFacesFour,
        GiPerspectiveDiceSixFacesFive,
        GiPerspectiveDiceSixFacesSix,
    ];

    const [currentDiceIndex, setCurrentDiceIndex] = useState<number | null>(
        null,
    );

    const rollDice = () => {
        const randomIndex = Math.floor(Math.random() * diceIcons.length);
        setCurrentDiceIndex(randomIndex);
    };

    const SelectedIcon =
        currentDiceIndex !== null
            ? diceIcons[currentDiceIndex]
            : GiPerspectiveDiceSixFacesRandom;

    return (
        <section className="relative z-2 h-[25vh] grid content-center">
            <div className="flex flex-col justify-between items-center gap-5 group">
                <Button className="font-semibold" />
                <motion.div
                    onClick={rollDice}
                    whileTap={{
                        rotate: 360,
                    }}
                    className="peer-hover:animate-bounce"
                >
                    <SelectedIcon className="sm:h-15 sm:w-15 h-20 w-20" />
                </motion.div>
                <div className="text-3xl">
                    <span>Make your move!</span>
                </div>
            </div>
        </section>
    );
};

export default ButtonContainer;
