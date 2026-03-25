import React, { type PropsWithChildren } from 'react';
import { SiReactivex } from 'react-icons/si';

const Loading: React.FC<PropsWithChildren> = ({children}) => {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <div className="h-10 w-10 flex justify-center items-center animate-spin">
                <SiReactivex className="h-8 w-8"></SiReactivex>
            </div>
            {children}
        </div>
    );
};

export default Loading;
