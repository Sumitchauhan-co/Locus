import React, { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalContext } from '../contexts/ModalContext';
import { AuthContext } from '../contexts/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import Loading2 from './Loading2';
import { Icons } from '../utils/icons';

interface FormInputs {
    input: string;
    password: string;
}

const Login: React.FC = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    // const { loading } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const { openModal } = useContext(ModalContext);

    const { login } = useContext(AuthContext);
    const { closeModal } = useContext(ModalContext);
    const [showPassword, setShowPassword] = useState(false);

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
        const { input, password } = data;

        const payload = {
            username: input.includes('@') ? undefined : input,
            email: input.includes('@') ? input : undefined,
            password,
        };

        try {
            setLoading(true);
            const res = await login(payload);
            console.log(res);

            if (res?.errorMessage) {
                setError(
                    res?.errorMessage ||
                        'Something went wrong...Please try again later!',
                );
                return;
            }
            reset();
            closeModal();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
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
                    <h1>Login</h1>
                </span>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center sm:p-7 p-3"
            >
                <div className="flex flex-col w-[90vmin] x-sm:w-[75vmin] sm:w-[80vmin] hover:bg-(--tertiary-color) bg-(--secondary-color) gap-10 sm:gap-12 rounded-3xl px-5 sm:px-12 py-10 sm:py-15">
                    <div className="w-full flex flex-col gap-3">
                        <label className="w-full text-lg sm:text-xl font-semibold">
                            Username or Email
                        </label>
                        <input
                            className="autofill:shadow-[inset_0_0_0px_1000px_rgb(225,225,225)] p-2 rounded-xl border-2 border-neutral-300 focus-visible:border-neutral-200 focus-visible:border-3 outline-none"
                            type="text"
                            placeholder="Enter username or email"
                            {...register('input', {
                                required: {
                                    value: true,
                                    message: 'Username or email is required',
                                },
                            })}
                        />
                        {errors.input?.message && (
                            <p className="text-sm text-red-500 font-semibold">
                                {errors.input.message}
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
                                    <span>Login</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                    <div className="w-full flex justify-center items-center text-sm sm:text-[1rem] gap-2">
                        <p>Don't have an account?</p>
                        <span
                            onClick={() => openModal('signup')}
                            className="cursor-pointer active:underline sm:hover:underline text-lg hover:text-(--text-color2) font-semibold"
                        >
                            Sign up
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
                className="w-full sticky mt-auto pb-50 cursor-pointer flex flex-col justify-center items-center sm:text-lg text-[1rem] gap-2"
            >
                <span>Scroll Up</span>
                <div className="h-10 w-10 flex justify-center items-center">
                    <Icons.arrowUp className="h-7 w-7 sm:h-8 sm:w-8 animate-bounce"></Icons.arrowUp>
                </div>
            </motion.div>
        </section>
    );
};

export default Login;
