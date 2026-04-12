import React, { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowAltCircleUp, FaEye, FaEyeSlash } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';
import { ModalContext } from '../contexts/ModalContext';
import { AuthContext } from '../contexts/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import Loading2 from './Loading2';

interface FormInputs {
    username: string;
    email: string;
    password: string;
}

const Signup: React.FC = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    // const { loading } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const { signup } = useContext(AuthContext);
    const { closeModal } = useContext(ModalContext);
    const [showPassword, setShowPassword] = useState(false);

    const [username, setUsername] = useState('');

    const targetRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start end', 'end start'],
    });
    const opacity = useTransform(scrollYProgress, [0, 0.75], [0, 1]);

    const {
        register,
        handleSubmit,
        // watch,
        reset,
        formState: { errors },
    } = useForm<FormInputs>();

    const scrollTop = () => {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth',
        });
    };

    const onSubmit = async (data: FormInputs) => {
        try {
            setLoading(true)
            const res = await signup(data);
            if (res?.statusCode == 409) {
                setError(
                    res.errorMessage ||
                        'Something went wrong...Please try again later!',
                );
                return;
            }

            reset();
            closeModal();
        } catch (error) {
            console.log(error);
        } finally{
            setLoading(false)
        }
    };

    return (
        <section className="min-h-screen w-full text-(--text-color) absolute inset-0 z-9999 flex flex-col items-center justify-start bg-(--backdrop-color) backdrop-blur-lg overflow-y-auto">
            <div
                onClick={() => closeModal()}
                className="absolute top-5 right-5 mt-15"
            >
                <RxCross1 className="h-7 w-7" />
            </div>
            <div className="h-fit w-full flex justify-center mt-25">
                <span className="bg-transparent text-3xl md:text-4xl relative top-6 sm:top-12 font-semibold">
                    <h1>Signup</h1>
                </span>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center sm:p-7 p-3"
            >
                <div className="flex flex-col w-[90vmin] x-sm:w-[75vmin] sm:w-[80vmin] hover:bg-(--tertiary-color) bg-(--secondary-color) gap-10 sm:gap-12 rounded-3xl px-5 sm:px-12 py-10 sm:py-15">
                    <div className="flex flex-col gap-3">
                        <label className="w-full text-lg sm:text-xl font-semibold">
                            Username
                        </label>
                        <input
                            className="autofill:shadow-[inset_0_0_0px_1000px_rgb(225,225,225)] p-2 rounded-xl border-2 border-neutral-300 focus-visible:border-neutral-200 focus-visible:border-3 outline-none"
                            type="text"
                            placeholder="Enter username"
                            {...register('username', {
                                required: {
                                    value: true,
                                    message: 'Username is required',
                                },
                            })}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="text-start text-yellow-500">
                            <p>{username.trim().split(/\s+/).join('_')}</p>
                        </div>
                        {errors.username?.message && (
                            <p className="text-sm text-red-500 font-semibold">
                                {errors.username.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="w-full text-lg sm:text-xl font-semibold">
                            Email
                        </label>
                        <input
                            className="autofill:shadow-[inset_0_0_0px_1000px_rgb(225,225,225)] p-2 rounded-xl border-2 border-neutral-300 focus-visible:border-neutral-200 focus-visible:border-3 outline-none"
                            type="email"
                            placeholder="Enter email"
                            {...register('email', {
                                required: {
                                    value: true,
                                    message: 'Email is required',
                                },
                                minLength: {
                                    value: 6,
                                    message:
                                        'Minimum length should be atleast 6',
                                },
                            })}
                        />
                        {errors.email?.message && (
                            <p className="text-sm text-red-500 font-semibold">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full flex flex-col gap-3 mb-2">
                        <label className="w-full text-lg sm:text-xl font-semibold">
                            Password
                        </label>
                        <div className="w-full relative flex justify-end items-center group">
                            <input
                                className="w-full autofill:shadow-[inset_0_0_0px_1000px_rgb(225,225,225)] p-2 rounded-xl border-2 border-neutral-300 focus-visible:border-neutral-200 focus-visible:border-3 outline-none"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                {...register('password', {
                                    required: {
                                        value: true,
                                        message: 'Password is required',
                                    },
                                    minLength: {
                                        value: 8,
                                        message:
                                            'Minimum length should be atleast 8',
                                    },
                                })}
                            />
                            <span
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="h-full w-10 bg-neutral-700 border border-neutral-300 rounded-r-xl absolute cursor-pointer select-none flex justify-center items-center"
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                        {errors.password?.message && (
                            <p className="text-sm text-red-500 font-semibold">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <motion.button
                            type={`${loading ? 'reset' : 'submit'}`}
                            whileHover={{ scale: 1.025, y: 1 }}
                            whileTap={{ scale: 0.95 }}
                            className={` ${loading ? 'cursor-not-allowed' : 'cursor-pointer'} w-full p-2 font-semibold text-lg bg-(--button-color) hover:bg-(--button-hover-color) active:bg-(--button-hover-color) text-black rounded-2xl flex justify-center items-center`}
                        >
                            {loading ? (
                                <Loading2 />
                            ) : (
                                <>
                                    <span>Sign up</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                    {error && (
                        <p className="text-lg text-red-500 text-center font-semibold">
                            {error}
                        </p>
                    )}
                </div>
            </form>
            <motion.div
                onClick={scrollTop}
                style={{ opacity }}
                className="w-full sticky mt-auto pb-40 md:pb-30 bottom-0 cursor-pointer flex flex-col justify-center items-center sm:text-lg text-[1rem] gap-2"
            >
                <span>Scroll Up</span>
                <div className="h-10 w-10 flex justify-center items-center">
                    <FaArrowAltCircleUp className="h-7 w-7 sm:h-8 sm:w-8 animate-bounce"></FaArrowAltCircleUp>
                </div>
            </motion.div>
        </section>
    );
};

export default Signup;
