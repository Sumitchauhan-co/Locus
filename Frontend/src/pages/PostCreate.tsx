import React, { useContext, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ModalContext } from '../contexts/ModalContext';
import api from '../api/axios';

interface FormInputs {
    image: FileList;
    caption: string;
}

const emojis: string = '🤔😏👽🤖🐥🦋👀🧠🪲🐰🦁😉😎😀🫶✨🎉💎🧸🗿📍☕🍪';

const random: string = [...emojis][
    Math.floor(Math.random() * [...emojis].length)
];

const PostCreate: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { openModal } = useContext(ModalContext);

    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        // formState: { errors },
    } = useForm<FormInputs>();

    const captionValue = watch('caption');

    const handleCreatePost = () => {
        if (!user) {
            openModal('login');
            return false;
        }
        return true;
    };

    const onSubmit = async (data: FormInputs) => {
        if (handleCreatePost()) {
            const formData = new FormData();
            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]);
            }

            formData.append('caption', data.caption);

            try {
                await api.post(
                    '/api/post/create-post',
                    formData,
                );
                reset();
                navigate('/posts');
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    console.log(err.response?.data);
                }
            }
        }
    };

    const { ref: captionRef, ...captionRegister } = register('caption', {
        required: true,
    });

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [captionValue]);

    return (
        <section className="h-fit py-20">
            <div className="text-4xl sm:text-5xl flex flex-col px-3 text-center mb-15">
                <h1>Create the post,</h1>
                <h1>others will <p className='inline text-pink-500'>love</p> to see!</h1>
            </div>
            <div className="h-fit w-full flex justify-center">
                <span className="bg-(--primary-color) rounded-lg text-(--text-color) px-3 py-1 text-3xl md:text-4xl relative top-12 font-semibold">
                    <h1>Create</h1>
                </span>
            </div>
            <form
                className="flex flex-col items-center p-7"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col w-[85vmin] x-sm:w-[75vmin] sm:w-[80vmin] md:w-[85vmin] xl:w-1/3 hover:bg-(--tertiary-color) bg-(--secondary-color) gap-10 sm:gap-12 rounded-3xl px-5 sm:px-12 py-10 sm:py-15">
                    <div className="flex flex-col gap-5">
                        <label className="text-xl text-(--text-color) sm:text-2xl p-1">
                            <span>Post</span>
                        </label>
                        <div className="flex justify-center items-center">
                            <input
                                {...register('image', {
                                    required: true,
                                })}
                                className="w-[85%] border-2 border-(--input-ring-color) p-2 px-3 rounded-lg text-sm text-neutral-500"
                                type="file"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <label className="text-xl text-(--text-color) sm:text-2xl p-1 transition-all ease-in-out">
                            <span>Caption</span>
                        </label>
                        <div className="flex justify-center items-center">
                            <div className="h-fit w-[85%] border-2 p-1 x-sm:p-2 rounded-xl grid content-center border-(--input-ring-color)">
                                <textarea
                                    {...captionRegister}
                                    placeholder={`Posto...${random}`}
                                    className="h-fit resize-none text-sm p-1 px-2 appearance-none focus:ring-0 outline-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                    ref={(e) => {
                                        captionRef(e);
                                        textareaRef.current = e;
                                    }}
                                    rows={1}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="h-fit w-full flex justify-center items-center">
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            type="submit"
                            className="h-10 w-25 cursor-pointer rounded-xl bg-(--button-color) hover:bg-(--button-hover-color) text-black grid content-center font-semibold"
                        >
                            <span>Submit</span>
                        </motion.button>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default PostCreate;
