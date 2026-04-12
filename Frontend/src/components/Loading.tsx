import React, { type PropsWithChildren } from 'react';
import { Icons } from '../utils/icons';

const Loading: React.FC<PropsWithChildren> = ({children}) => {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <div className="h-10 w-10 flex justify-center items-center animate-spin">
                <Icons.logo className="h-8 w-8"></Icons.logo>
            </div>
            {children}
        </div>
    );
};

export default Loading;
