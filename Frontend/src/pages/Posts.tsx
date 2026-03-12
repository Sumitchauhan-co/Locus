import React, { useState, useEffect, useContext } from 'react';
import Button from '../components/Button';
import api from '../api/axios';
import axios from 'axios';
import { SiReactivex } from 'react-icons/si';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa6';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AuthContext } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { RxCross1 } from 'react-icons/rx';
import { formatPostTime } from '../utils/time.ts';
import { ModalContext } from '../contexts/ModalContext.ts';

interface User {
    _id: string;
    username: string;
    email: string;
}

interface Post {
    _id: string;
    mediaURL: string;
    mediaType: string;
    caption: string;
    user: User;
    likesCount: string[];
}

const Posts: React.FC = () => {
    const { openModal } = useContext(ModalContext);
    const [activePostId, setActivePostId] = useState<string | null>(null);
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState<Array<Post>>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const handleLike = async (postId: string) => {
        if (!user) {
            return openModal("login")
        };

        let updatedLikes: string[] = [];

        setPosts((prev) =>
            prev.map((post) => {
                if (post._id !== postId) return post;

                const liked = post.likesCount.includes(user._id);

                updatedLikes = liked
                    ? post.likesCount.filter((id) => id !== user._id)
                    : [...post.likesCount, user._id];

                return { ...post, likesCount: updatedLikes };
            }),
        );

        try {
            const res = await api.patch(`/api/post/${postId}/like`);

            setPosts((prev) =>
                prev.map((post) =>
                    post._id === postId
                        ? { ...post, likesCount: res.data.likesCount }
                        : post,
                ),
            );
        } catch (err) {
            console.log(err);
        }
    };

    const removePost = async (postId: string) => {
        try {
            const res = await api.delete(`/api/post/${postId}`);
            console.log(res);

            setPosts((prev) => prev.filter((post) => post._id !== postId));

            setActivePostId(null);
        } catch (error) {
            console.log(error);
        }
    };

    const isotime = new Date().toISOString();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/api/post/');
                setPosts(res.data.posts);
                console.log(res.data.posts);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    console.log(err.response?.data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="h-10 w-10 flex justify-center items-center animate-spin">
                    <SiReactivex className="h-8 w-8"></SiReactivex>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen w-full flex flex-col items-center ">
            <div className="w-full grid content-center mb-10">
                <div className="text-4xl sm:text-5xl flex flex-col px-3 text-center text-(--text-color) font-[cursive]">
                    <h1>Your amazing posts,</h1>
                    <h1>for everyone!</h1>
                </div>
            </div>

            <div className="h-fit w-full py-2 sm:py-10 text-center sm:m-0 mb-10">
                <h2 className="text-pink-500 text-4xl sm:text-5xl font-semibold">
                    Posts
                </h2>
            </div>

            {posts.length > 0 ? (
                <div className="flex-1 h-screen w-full relative max-w-6xl sm:py-4 px-4">
                    {/* scroll-smooth overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] */}
                    <div
                        className="h-fit w-full grid gap-6
                        grid-cols-1
                        x-sm:grid-cols-2
                        sm:grid-cols-3
                        md:grid-cols-4"
                    >
                        {posts?.map((post) => (
                            <div
                                className="relative"
                                key={post._id}
                            >
                                <motion.div
                                    whileHover={{
                                        scale: 1.025,
                                    }}
                                    className={`${
                                        activePostId === post._id
                                            ? 'blur-[3px]'
                                            : ''
                                    } h-fit w-fit relative hover:bg-(--tertiary-color) p-2 flex flex-col border border-(--border-color) rounded-xl bg-(--tertiary-color)`}
                                >
                                    {/* header */}
                                    <div className="h-fit w-full flex flex-col relative mb-2">
                                        {/* userame */}
                                        <div className="text-sm text-start text-(--text-color2) hover:underline">
                                            {post.user.username}
                                        </div>
                                        {/* caption */}
                                        <div className="text-[1rem] text-start">
                                            {post.caption}
                                        </div>
                                        {/* options */}
                                        <motion.div
                                            onClick={() =>
                                                setActivePostId(post._id)
                                            }
                                            whileTap={{
                                                scale: 1.25,
                                            }}
                                            className={`${user?._id !== post._id ? 'hidden' : 'absolute'} top-3 right-3`}
                                        >
                                            <BsThreeDotsVertical className="h-4 w-4" />
                                        </motion.div>
                                    </div>
                                    {/* img/video */}
                                    <div className="h-full">
                                        <div className="h-full w-full">
                                            {post.mediaType === 'video' && (
                                                <video
                                                    muted
                                                    loop
                                                    controls
                                                    src={post.mediaURL}
                                                    className="w-full rounded-lg sm:aspect-square aspect-4/5 object-cover"
                                                ></video>
                                            )}
                                            {post.mediaType === 'image' && (
                                                <img
                                                    src={post.mediaURL}
                                                    loading="lazy"
                                                    alt="Post"
                                                    className="w-full rounded-lg sm:aspect-square aspect-4/5 object-cover"
                                                ></img>
                                            )}
                                        </div>

                                        <div className="text-[0.7rem] text-end text-(--text-color2)">
                                            {formatPostTime(isotime)}
                                        </div>
                                    </div>
                                    {/* likes */}
                                    <div className="h-fit w-full flex px-3">
                                        <div className="h-full w-2/7 flex justify-between items-center">
                                            <motion.div
                                                whileTap={{
                                                    scale: 1.125,
                                                }}
                                                onClick={() =>
                                                    handleLike(post._id)
                                                }
                                                className="flex flex-col items-center cursor-pointer"
                                            >
                                                {post.likesCount.includes(
                                                    user?._id ?? '',
                                                ) ? (
                                                    <div className="h-fit w-fit">
                                                        <FaHeart className="h-4.5 w-4.5 fill-pink-700" />
                                                    </div>
                                                ) : (
                                                    <div className="h-fit w-fit">
                                                        <FaRegHeart
                                                            onClick={() =>
                                                                handleLike(
                                                                    post._id,
                                                                )
                                                            }
                                                            className="h-4.5 w-4.5"
                                                        />
                                                    </div>
                                                )}
                                                <span className="text-[0.7rem]">
                                                    {post.likesCount.length}
                                                </span>
                                            </motion.div>
                                            {/* <FaHeart className="h-6 w-6 fill-pink-700" /> */}
                                        </div>
                                    </div>
                                </motion.div>
                                {activePostId === post._id && (
                                    <div className="h-fit w-fit py-4 flex flex-col border rounded-lg absolute top-3 right-3 z-2 bg-(--tertiary-color)/85 cursor-pointer">
                                        <div className="h-fit w-full px-12 flex justify-center items-center hover:bg-(--primary-color)">
                                            <span
                                                onClick={() =>
                                                    removePost(post._id)
                                                }
                                                className="text-(--text-color) text-sm leading-8"
                                            >
                                                Remove
                                            </span>
                                        </div>
                                        <div
                                            onClick={() =>
                                                setActivePostId(null)
                                            }
                                            className="absolute top-1 right-1"
                                        >
                                            <RxCross1 className="h-3 w-3" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="h-fit w-full p-2 flex flex-col justify-center items-center gap-5 text-neutral-300">
                    <h3 className="x-sm:text-2xl md:text-3xl text-xl">
                        No posts yet!
                    </h3>
                    <div className="flex justify-center items-center gap-3">
                        <Button className="font-semibold" />
                    </div>
                </div>
            )}
        </section>
    );
};

export default Posts;
