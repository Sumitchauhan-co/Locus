import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';
import { ModalContext } from '../contexts/ModalContext';
import { AuthContext } from '../contexts/AuthContext';
import { motion } from 'motion/react';

interface FormInputs {
    input: string;
    password: string;
}

const Login: React.FC = () => {
    const { openModal } = useContext(ModalContext);

    const { login } = useContext(AuthContext);
    const { closeModal } = useContext(ModalContext);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        // watch,
        reset,
        formState: { errors },
    } = useForm<FormInputs>();

    const onSubmit = async (data: FormInputs) => {
        const { input, password } = data;

        const payload = {
            username: input.includes('@') ? undefined : input,
            email: input.includes('@') ? input : undefined,
            password,
        };

        try {
            await login(payload);
            reset();
            closeModal();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="min-h-screen w-full text-(--text-color) absolute inset-0 z-3 flex flex-col items-center justify-center bg-(--backdrop-color) backdrop-blur-lg overflow-y-auto">
            <div
                onClick={() => closeModal()}
                className="absolute top-5 right-5"
            >
                <RxCross1 className="h-7 w-7" />
            </div>
            <div className="h-fit w-full flex justify-center">
                <span className="bg-transparent px-3 py-1 text-3xl md:text-4xl relative top-12 font-semibold">
                    <h1>Login</h1>
                </span>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center p-7 "
            >
                <div className="flex flex-col w-[85vmin] x-sm:w-[75vmin] sm:w-[80vmin] md:w-[85vmin] hover:bg-(--tertiary-color) bg-(--secondary-color) gap-10 sm:gap-12 rounded-3xl px-5 sm:px-12 py-10 sm:py-15">
                    <div className="w-full flex flex-col gap-3">
                        <label className="w-full text-xl font-semibold">
                            Username or Email
                        </label>
                        <input
                            className="autofill:shadow-[inset_0_0_0px_1000px_rgb(225,225,225)] p-2 rounded-xl border-2 border-neutral-300 focus-visible:border-neutral-200 focus-visible:border-3 outline-none"
                            type="text"
                            placeholder="Enter username or email"
                            {...register('input', {
                                required: true,
                            })}
                        />
                    </div>

                    <div className="w-full flex flex-col gap-3 mb-2">
                        <label className="w-full text-xl font-semibold">
                            Password
                        </label>
                        <div className="w-full relative flex justify-end items-center group">
                            <input
                                className="w-full autofill:shadow-[inset_0_0_0px_1000px_rgb(225,225,225)] p-2 rounded-xl border-2 border-neutral-300 focus-visible:border-neutral-200 focus-visible:border-3 outline-none"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                {...register('password', {
                                    required: true,
                                    // minLength: {
                                    //     value: 8,
                                    //     message:
                                    //         'Minimum length should be atleast 8',
                                    // },
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
                            <p className="text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <motion.button
                            whileHover={{ scale: 1.025, y: 1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full p-2 font-semibold text-lg bg-(--button-color) hover:bg-(--button-hover-color) active:bg-(--button-hover-color) text-black rounded-2xl flex justify-center items-center"
                        >
                            <p>Login</p>
                        </motion.button>
                    </div>
                    <div className="w-full flex justify-center text-sm sm:text-[1rem] gap-2">
                        <p>Don't have an account?</p>
                        <span
                            onClick={() => openModal('signup')}
                            className="cursor-pointer hover:underline hover:text-(--text-color2)"
                        >
                            Sign up
                        </span>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default Login;
