import React, { useContext, useState } from 'react';
import api from '../api/axios.ts';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa6';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AuthContext } from '../contexts/AuthContext.ts';
import { motion } from 'framer-motion';
import { RxCross1 } from 'react-icons/rx';
import { formatPostTime } from '../utils/time.ts';
import { ModalContext } from '../contexts/ModalContext.ts';
import type { Post } from '../types/Posts.ts';

type Props = {
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

const PostsFeed: React.FC<Props> = ({ posts, setPosts }) => {
    const [mediaLoaded, setMediaLoaded] = useState<Record<string, boolean>>({});
    const { openModal } = useContext(ModalContext);
    const [activePostId, setActivePostId] = useState<string | null>(null);
    const { user, setLoading } = useContext(AuthContext);

    const handleLike = async (postId: string) => {
        if (!user) {
            return openModal('login');
        }

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
            setLoading(true);
            await api.delete(`/api/post/${postId}`);

            setPosts((prev) => prev.filter((post) => post._id !== postId));

            setActivePostId(null);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 h-screen w-full relative max-w-7xl sm:py-4 md:px-6 sm:px-8 x-sm:px-20 px-4">
            {/* scroll-smooth overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] */}
            <div
                className="h-fit w-full grid gap-6
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4"
            >
                {posts?.map((post) => (
                    <div
                        className="relative"
                        key={post._id}
                    >
                        {!mediaLoaded[post._id] && (
                            <div className="w-full max-w-md mx-auto p-4 border rounded-2xl shadow-sm space-y-3 animate-pulse">
                                <div className="h-4 w-32 bg-gray-300 rounded"></div>

                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-gray-300 rounded"></div>
                                    <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
                                </div>

                                <div className="w-full h-64 bg-gray-300 rounded-xl"></div>

                                <div className="flex justify-end">
                                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                                </div>

                                <div className="h-4 w-16 bg-gray-300 rounded"></div>
                            </div>
                        )}
                        <motion.div
                            className={`${
                                activePostId === post._id
                                    ? 'blur-xs animate-pulse'
                                    : ''
                            } h-fit w-fit relative hover:bg-(--post-bg-color) p-2 flex flex-col border border-(--border-color) rounded-xl bg-(--tertiary-color)`}
                        >
                            <div className="h-fit w-full flex flex-col relative mb-2">
                                <div className="text-[0.8rem] text-start text-(--text-color2) hover:underline">
                                    {post.user.username}
                                </div>
                                <div className=" sm:text-[0.9rem] text-[1rem] text-start">
                                    {post.caption}
                                </div>
                                <motion.div
                                    onClick={() => setActivePostId(post._id)}
                                    whileTap={{
                                        scale: 1.25,
                                    }}
                                    className={`${user?._id !== post.user._id ? 'hidden' : 'absolute'} top-3 right-3`}
                                >
                                    <BsThreeDotsVertical className="h-4 w-4" />
                                </motion.div>
                            </div>

                            {/* img/video */}
                            <div className="h-fit">
                                {post.mediaType === 'video' && (
                                    <video
                                        onLoadedData={() =>
                                            setMediaLoaded((prev) => ({
                                                ...prev,
                                                [post._id]: true,
                                            }))
                                        }
                                        muted
                                        loop
                                        controls
                                        src={post.mediaURL}
                                        className="w-full rounded-lg sm:aspect-[4.25/5] aspect-4/5 object-cover"
                                    ></video>
                                )}
                                {post.mediaType === 'image' && (
                                    <img
                                        onLoad={() =>
                                            setMediaLoaded((prev) => ({
                                                ...prev,
                                                [post._id]: true,
                                            }))
                                        }
                                        src={post.mediaURL}
                                        loading="lazy"
                                        alt="Post"
                                        className="w-full rounded-lg sm:aspect-[4.25/5] aspect-4/5 object-cover"
                                    ></img>
                                )}

                                <div className="text-[0.7rem] text-end text-(--text-color2)">
                                    {formatPostTime(post.createdAt)}
                                </div>
                            </div>
                            {/* likes */}
                            <div className="h-fit w-full flex px-3">
                                <div className="h-full w-2/7 flex justify-between items-center">
                                    <motion.div
                                        whileTap={{
                                            scale: 1.125,
                                        }}
                                        onClick={() => handleLike(post._id)}
                                        className="flex flex-col items-center cursor-pointer"
                                    >
                                        {post.likesCount.includes(
                                            user?._id ?? '',
                                        ) ? (
                                            <div className="h-fit w-fit">
                                                <FaHeart className="sm:h-5 sm:w-5 h-6 w-6 fill-pink-700" />
                                            </div>
                                        ) : (
                                            <div className="h-fit w-fit">
                                                <FaRegHeart
                                                    onClick={() =>
                                                        handleLike(post._id)
                                                    }
                                                    className="sm:h-5 sm:w-5 h-6 w-6"
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
                            <div className="h-fit w-fit sm:px-0 px-3 py-6 flex flex-col border rounded-xl absolute top-3 right-3 z-2 bg-(--options-color) cursor-pointer">
                                <div className="h-fit w-full px-15 flex justify-center items-center hover:bg-(--options-div-color) active:bg-(--options-div-color) text-(--text-color2) hover:text-(--text-color)">
                                    <span
                                        onClick={() => removePost(post._id)}
                                        className="text-xl sm:text-lg leading-12 sm:leading-12"
                                    >
                                        Remove
                                    </span>
                                </div>
                                <div
                                    onClick={() => setActivePostId(null)}
                                    className="h-7 w-7 absolute top-1 right-1 flex justify-center items-center active:bg-(--button-bg-color) hover:bg-(--button-bg-color) rounded-[50%]"
                                >
                                    <RxCross1 className="h-5 w-5 sm:h-4 sm:w-4" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostsFeed;
