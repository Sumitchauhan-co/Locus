import React from 'react';

const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <div className='min-h-screen overflow-x-clip relative bg-(--primary-color) text-white'>{children}</div>;
};

export default Container;
