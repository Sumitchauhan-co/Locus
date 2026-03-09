import React from 'react';

const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <div className='min-h-screen max-w-screen relative bg-(--primary-color) font-[tahoma] text-white'>{children}</div>;
};

export default Container;
