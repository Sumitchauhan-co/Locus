import React, { type PropsWithChildren } from 'react';
import { SiReactivex } from 'react-icons/si';

const Loading2: React.FC<PropsWithChildren> = ({children}) => {
    return (
        <div className="h-fit flex flex-col justify-center items-center">
            <div className="h-7 w-7 flex justify-center items-center animate-spin">
                <SiReactivex className="h-5 w-5"></SiReactivex>
            </div>
            {children}
        </div>
    );
};

export default Loading2;
