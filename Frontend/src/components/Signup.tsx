import React, { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalContext } from '../contexts/ModalContext';
import { AuthContext } from '../contexts/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import Loading2 from './Loading2';
import { Icons } from '../utils/icons';

interface FormInputs {
    username: string;
    email: string;
    password: string;
}

const Signup: React.FC = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const { signup } = useContext(AuthContext);
    const { closeModal } = useContext(ModalContext);
    const { openModal } = useContext(ModalContext);

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
        // reset,
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
            setLoading(true);

            const res = await signup(data);
            if (res?.statusCode) {
                setError(
                    res.errorMessage ||
                        'Something went wrong...Please try again later!',
                );
                return;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const callbackURL = import.meta.env.PROD
        ? `${import.meta.env.VITE_API_URL}/auth/google/callback`
        : 'http://localhost:3000/auth/google/callback';

    const handleOAuth = () => {
        window.location.href = `${callbackURL}`;
    };

    return (
        <section className="min-h-screen w-full text-(--text-color) absolute inset-0 z-9999 flex flex-col items-center justify-start bg-(--backdrop-color) backdrop-blur-lg overflow-y-auto">
            <div
                onClick={() => closeModal()}
                className="absolute top-5 right-5 mt-15"
            >
                <Icons.cross className="h-7 w-7" />
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
                        <div className="text-start text-neutral-400">
                            <p>{username.trim().split(/\s+/).join(' ')}</p>
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
                                {showPassword ? (
                                    <Icons.openEye />
                                ) : (
                                    <Icons.closeEye />
                                )}
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
                    <div className="w-full flex items-center justify-between text-[0.7rem] sm:text-sm">
                        <div className="h-px w-[45%] bg-gray-200"></div>
                        <span>Or</span>
                        <div className="h-px w-[45%] bg-gray-200"></div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.025, y: 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOAuth}
                        type="button"
                        className="w-full cursor-pointer font-semibold flex justify-center gap-4 text-lg text-black items-center p-2 rounded-2xl bg-(--input-color) hover:bg-(--button-hover-color)"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            width="32px"
                            height="32px"
                        >
                            <path
                                fill="#FFC107"
                                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                            <path
                                fill="#FF3D00"
                                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                            />
                            <path
                                fill="#4CAF50"
                                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                            />
                            <path
                                fill="#1976D2"
                                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                        </svg>
                        <span>Sign in with Google</span>
                    </motion.button>

                    <div className="w-full flex justify-center items-center text-sm sm:text-[1rem] gap-2">
                        <p>Already have an account?</p>
                        <span
                            onClick={() => openModal('login')}
                            className="cursor-pointer active:underline sm:hover:underline text-lg hover:text-(--text-color2) font-semibold"
                        >
                            Sign in
                        </span>
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
                    <Icons.arrowUp className="h-7 w-7 sm:h-8 sm:w-8 animate-bounce"></Icons.arrowUp>
                </div>
            </motion.div>
        </section>
    );
};

export default Signup;
