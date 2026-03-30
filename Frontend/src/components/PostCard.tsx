import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RxCross1 } from 'react-icons/rx';
import { formatPostTime } from '../utils/time.ts';
import type { Post } from '../types/Posts.ts';
import { ImBin } from 'react-icons/im';
import { FaRegComment } from 'react-icons/fa';
import Comment from './Comment.tsx';

interface PostCardProps {
    post: Post;
    isOwner: boolean;
    isActive: boolean;
    onLike: (id: string) => void;
    // onComment: (id: string) => void;
    onRemove: (id: string) => void;
    onToggleOptions: (id: string | null) => void;
    currentUserId?: string;
    isAdmin?: boolean;
    showComment: boolean;
    onToggleComments: (id: string) => void
}

const PostCard: React.FC<PostCardProps> = ({
    post,
    isOwner,
    isActive,
    onLike,
    onRemove,
    onToggleOptions,
    currentUserId,
    isAdmin,
    showComment,
    onToggleComments
}) => {
    const [loaded, setLoaded] = useState(false);
    const isLiked = post.likesCount.includes(currentUserId ?? '');

    return (
        <div className="relative group">
            <motion.div
                className={`${isActive ? 'blur-xs animate-pulse' : ''} 
                h-fit w-full relative p-2 flex flex-col border border-(--border-color) rounded-xl ${isOwner ? 'rounded-tl-none' : ''} bg-(--tertiary-color) hover:bg-(--post-bg-color) transition-colors`}
            >
                <div className="flex flex-col relative mb-2">
                    <span className="sm:text-sm text-(--text-color2) hover:underline cursor-pointer">
                        {post.user.username}
                    </span>
                    <p className="sm:text-[0.925rem] text-[1rem]">
                        {post.caption}
                    </p>

                    {(isOwner || isAdmin) && (
                        <motion.button
                            whileTap={{ scale: 1.2 }}
                            onClick={() => onToggleOptions(isActive ? null : post._id)}
                            className="absolute top-0 right-0 p-1"
                        >
                            <BsThreeDotsVertical className="h-4 w-4" />
                        </motion.button>
                    )}
                </div>

                {/* Media Container */}
                {post.mediaURL && (
                    <div className="relative w-full aspect-4/5 rounded-lg bg-neutral-800 overflow-hidden mt-2">
                        {!loaded && (
                            <div className="absolute inset-0 animate-pulse bg-neutral-700" />
                        )}
                        {post.mediaType === 'video' ? (
                            <video
                                src={post.mediaURL}
                                onLoadedData={() => setLoaded(true)}
                                className="w-full h-full object-cover"
                                controls
                                muted
                                loop
                            />
                        ) : (
                            <img
                                src={post.mediaURL}
                                onLoad={() => setLoaded(true)}
                                className="w-full h-full object-cover"
                                alt=""
                            />
                        )}
                    </div>
                )}

                <div className="text-[0.7rem] text-end text-(--text-color2) mt-2">
                    {formatPostTime(post.createdAt)}
                </div>

                {/* Interaction Bar */}
                <div className="flex items-center gap-10 px-1 mt-1">
                    <motion.button
                        whileTap={{ scale: 1.2 }}
                        onClick={() => onLike(post._id)}
                        className="flex flex-col items-center"
                    >
                        {isLiked ? (
                            <FaHeart className="h-5 w-5 fill-pink-700" />
                        ) : (
                            <FaRegHeart className="h-5 w-5" />
                        )}
                        <span className="text-sm">
                            {post.likesCount?.length || 0}
                        </span>
                    </motion.button>
                    <button
                        onClick={() => onToggleComments(post._id)}
                        title="comment"
                        type="button"
                        className=""
                    >
                        <FaRegComment className="h-5 w-5 " />
                        <span className="text-sm">
                            {post.comments?.length || 0}
                        </span>
                    </button>
                </div>
            </motion.div>

            {/* Options Dropdown */}
            {isActive && (
                <div className="min-w-45 sm:min-w-35 absolute top-2 right-2 z-10 bg-(--options-color) rounded-xl border border-(--border-color) shadow-xl overflow-hidden">
                    <button
                        title="remove"
                        type="button"
                        onClick={() => onRemove(post._id)}
                        className="w-full flex justify-center items-center py-3 my-5 sm:my-4 hover:bg-(--options-div-color) transition-colors text-sm font-medium"
                    >
                        <ImBin className="fill-red-500 h-7 w-7 sm:h-5 sm:w-5"></ImBin>
                    </button>
                    <button
                        title="cancel"
                        type="button"
                        onClick={() => onToggleOptions(null)}
                        className="absolute top-1 right-1 p-2 hover:bg-white/10 rounded-full"
                    >
                        <RxCross1 className="h-6 w-6 sm:h-4 sm:w-4" />
                    </button>
                </div>
            )}
            {showComment && (
                <Comment
                    className={`w-full h-full ${isOwner ? "rounded-tl-none" : ""}`}
                    currentUserId={currentUserId}
                    isOwner={isOwner}
                    isAdmin={isAdmin}
                    isActive={isActive}
                    postId={post._id}
                    showComment={showComment}
                    setCommentOff={() => onToggleComments("")}
                />
            )}
        </div>
    );
};

export default PostCard;
