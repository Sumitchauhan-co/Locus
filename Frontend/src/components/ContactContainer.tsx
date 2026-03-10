import React from 'react';

const ContactContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div className="min-h-screen max-w-screen bg-(--bg-color) flex justify-center items-center">
            <div className="h-fit w-fit p-8 mt-8 mb-8 bg-(--form-color) shadow-xl rounded-2xl">
                {children}
            </div>
        </div>
    );
};

export default ContactContainer;
