import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ModalContext } from '../contexts/ModalContext';
import api from '../api/axios';
import { ScrollToTop } from '../components/ScrollTo';
import Loading2 from '../components/Loading2';

interface FormInputs {
    media?: FileList;
    caption?: string;
}

const emojis: string = '🤔😏👽🤖🐥🦋👀🧠🪲🐰🦁😉😎😀🫶✨🎉💎🧸🗿📍☕🍪';

const random: string = [...emojis][
    Math.floor(Math.random() * [...emojis].length)
];

const PostCreate: React.FC = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const { openModal } = useContext(ModalContext);

    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormInputs>();

    const media = watch('media');

    let hasImage = media && media.length > 0;
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
            if (data.media && data.media.length > 0) {
                formData.append('media', data.media[0]);
            }

            formData.append('caption', data.caption || '');

            try {
                setLoading(true);
                await api.post('/api/post/create', formData);

                reset();
                navigate('/posts');
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    if (err.status == 400) {
                        setError(
                            err.response?.data.message ||
                                'Something went wrong',
                        );
                    }
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const { ref: captionRef, ...captionRegister } = register('caption', {
        maxLength: {
            value: 100,
            message: 'Caption is too long!',
        },
    });

    useEffect(() => {
        if (!user) {
            openModal('login');
        }
        if (textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [captionValue]);

    return (
        <section className="h-fit py-20">
            <ScrollToTop />

            <div className="text-4xl sm:text-5xl flex flex-col px-3 text-center mb-15">
                <h1>Create the post,</h1>
                <h1>
                    others will <p className="inline text-pink-500">love</p> to
                    see!
                </h1>
            </div>
            <div className="h-fit w-full flex justify-center relative bottom-5">
                <span className="bg-transparent text-(--text-color) text-4xl md:text-5xl relative top-12 tracking-[0.1rem] font-semibold">
                    <h1>Create</h1>
                </span>
            </div>
            <form
                className="flex flex-col items-center sm:p-7 p-3"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col w-[90vmin] x-sm:w-[75vmin] sm:w-[80vmin] md:w-[85vmin] xl:w-2/5 hover:bg-(--tertiary-color) bg-(--secondary-color) gap-10 sm:gap-12 rounded-3xl px-5 sm:px-12 py-10 sm:py-15">
                    <div className="flex flex-col gap-5">
                        <label className="text-2xl text-(--text-color)">
                            <span>Post</span>
                        </label>
                        <div className="flex flex-col justify-center items-center">
                            <input
                                {...register('media')}
                                className={`w-[90%] border-2 border-(--input-ring-color) p-2 rounded-xl text-[1rem] ${hasImage ? 'text-white' : 'text-neutral-500'}`}
                                type="file"
                            />
                            {errors.media?.message && (
                                <p className="text-sm text-red-500 p-2">
                                    {errors.media.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <label className="text-2xl text-(--text-color) transition-all ease-in-out">
                            <span>Caption or Message</span>
                        </label>
                        <div className="flex flex-col justify-center items-center">
                            <div className="h-fit w-[90%] border-2 grid content-center rounded-xl border-(--input-ring-color)">
                                <textarea
                                    {...captionRegister}
                                    placeholder={`Posto...${random}`}
                                    className="h-fit w-full p-2 resize-none text-[1rem] appearance-none focus:ring-0 outline-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                    ref={(e) => {
                                        captionRef(e);
                                        textareaRef.current = e;
                                    }}
                                    rows={1}
                                    maxLength={101}
                                />
                            </div>
                            {errors.caption?.message && (
                                <p className="text-sm text-red-500 p-2">
                                    {errors.caption.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="h-fit w-full flex justify-center items-center">
                        <motion.button
                            type={loading ? 'reset' : 'submit'}
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={() => {
                                if (loading) {
                                    hasImage = false;
                                }
                            }}
                            className={` ${loading ? 'cursor-not-allowed' : 'cursor-pointer'} sm:h-10 sm:w-30 h-12 w-36 rounded-2xl sm:rounded-xl bg-(--button-color) hover:bg-(--button-hover-color) text-black grid content-center font-semibold`}
                        >
                            {loading ? (
                                <Loading2 />
                            ) : (
                                <>
                                    <span className="sm:text-[1rem] text-lg">
                                        Submit
                                    </span>
                                </>
                            )}
                        </motion.button>
                    </div>
                    <div className="text-yellow-500 text-center">
                        <p className="font-bold inline">Note</p> : Create post
                        with media & caption or just message or only with media
                    </div>
                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}
                </div>
            </form>
        </section>
    );
};

export default PostCreate;
