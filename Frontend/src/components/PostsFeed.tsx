import React, { useContext, useState } from 'react';
import api from '../api/axios.ts';
import { ModalContext } from '../contexts/ModalContext.ts';
import type { Post } from '../types/Posts.ts';
import PostCard from './PostCard.tsx';
import { AuthContext } from '../contexts/AuthContext.ts';

type Props = {
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

const PostsFeed: React.FC<Props> = ({ posts, setPosts }) => {

    const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
    const { openModal } = useContext(ModalContext);
    const [activePostId, setActivePostId] = useState<string | null>(null);
    const { user, setLoading } = useContext(AuthContext);

    const isAdmin = user?.email === 'chauhan.sumit3012@gmail.com';

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
        <div className="flex-1 h-screen w-full relative max-w-7xl sm:py-4 md:px-6 px-4">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {posts?.map((post) => {
                    return (
                        <PostCard
                            key={post._id}
                            post={post}
                            isOwner={user?._id === post.user?._id}
                            isActive={activePostId === post._id}
                            onLike={handleLike}
                            onRemove={removePost}
                            onToggleOptions={setActivePostId}
                            currentUserId={user?._id}
                            isAdmin={isAdmin}
                            showComment={openCommentPostId === post._id}
                            onToggleComments={(id : string) =>
                                setOpenCommentPostId((prev) =>
                                    prev === id ? null : id,
                                )
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default PostsFeed;
