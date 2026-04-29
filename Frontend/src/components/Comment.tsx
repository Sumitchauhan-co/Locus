import React, { useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { twMerge } from 'tailwind-merge';
import Loading2 from './Loading2';
import { AuthContext } from '../contexts/AuthContext';
import { ModalContext } from '../contexts/ModalContext';
import { Icons } from '../utils/icons';
import { getBgColor } from '../utils/bgColor';

interface CommentProps {
    className: string;
    isActive: boolean;
    isOwner: boolean;
    isAdmin?: boolean;
    postId: string;
    activeCommentId?: string;
    currentUserId?: string;
    showComment: boolean;
    setCommentOff: () => void;
}

interface Comment {
    _id: string;
    userId: string;
    username: string;
    text: string;
}

const Comment: React.FC<CommentProps> = ({
    className,
    isAdmin,
    postId,
    currentUserId,
    showComment,
    setCommentOff,
}) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<Array<Comment>>([]);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    const { openModal } = useContext(ModalContext);
    const { user } = useContext(AuthContext);

    const initial = user?.username?.charAt(0).toUpperCase() || 'U';
    const bgColor = getBgColor(user?.username || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            setLoading(true);
            const res = await api.post(`/api/post/create-comment/${postId}`, {
                text,
            });

            const newComment = res.data.comment || res.data.comments;

            if (newComment && newComment._id) {
                setComments((prev) => [newComment, ...prev]);
                setText('');
            } else {
                console.error(
                    'New comment data missing from response',
                    res.data,
                );
            }
        } catch (err) {
            console.error('Failed to post comment:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            setLoading(true);
            await api.delete(`/api/post/${postId}/comment/${commentId}`);
            setComments((prev) => prev.filter((c) => c._id !== commentId));
            setActiveMenuId(null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            return openModal('login');
        }

        const handleComment = async (postId: string) => {
            try {
                setLoading(true);
                const res = await api.get(`/api/post/comment/${postId}`);
                setComments(res.data.comments);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        handleComment(postId);
    }, [postId]);

    return (
        <section
            className={twMerge(
                'h-full z-1 flex flex-col absolute bottom-0 bg-(--primary-color) border border-(--border-color) rounded-xl',
                className,
            )}
        >
            {showComment && (
                <div className="h-full w-full">
                    <div
                        onClick={setCommentOff}
                        className="absolute top-5 right-5"
                    >
                        <Icons.cross className="h-5 w-5" />
                    </div>
                    <div className="text-2xl sm:text-xl p-3">
                        <h3>Comments</h3>
                    </div>
                    <div className="h-[300px] w-full overflow-y-scroll border-y border-(--border-color)">
                        {!loading &&
                            comments.map((comment) => {
                                const isCommentOwner =
                                    comment?.userId === currentUserId;
                                const isMenuOpen =
                                    activeMenuId === comment?._id;

                                return (
                                    <div
                                        key={comment?._id}
                                        className={`h-fit w-full relative p-2 flex flex-col border border-(--border-color)`}
                                    >
                                        <div className="flex flex-col relative gap-2">
                                            <div className="flex justify-start items-center gap-2">
                                                <div
                                                    className={`h-6 w-6 flex items-center justify-center rounded-full text-(--text-color) font-bold ${bgColor} border-2 border-white text-sm shadow-sm`}
                                                >
                                                    <span>{initial}</span>
                                                </div>
                                                <span className="sm:text-sm text-(--text-color2) hover:underline cursor-pointer">
                                                    {comment?.username}
                                                </span>
                                            </div>
                                            <p className="sm:text-[0.925rem] text-[1rem]">
                                                {comment?.text}
                                            </p>
                                            {(isCommentOwner || isAdmin) && (
                                                <button
                                                    type="button"
                                                    title="options"
                                                    onClick={() =>
                                                        setActiveMenuId(
                                                            isMenuOpen
                                                                ? null
                                                                : comment._id,
                                                        )
                                                    }
                                                    className="absolute top-0 right-0 p-1"
                                                >
                                                    <Icons.threeDots className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                        {isMenuOpen && (
                                            <div className="min-w-45 sm:min-w-35 absolute top-2 right-2 z-10 bg-(--options-color) rounded-xl border border-(--border-color) shadow-xl overflow-hidden">
                                                <button
                                                    title="remove"
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteComment(
                                                            comment._id,
                                                        )
                                                    }
                                                    className="w-full flex justify-center items-center py-3 my-5 sm:my-4 hover:bg-(--options-div-color) transition-colors text-sm font-medium"
                                                >
                                                    <Icons.bin className="fill-red-500 h-7 w-7 sm:h-5 sm:w-5"></Icons.bin>
                                                </button>
                                                <button
                                                    title="cancel"
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveMenuId(null)
                                                    }
                                                    className="absolute top-1 right-1 p-2 hover:bg-white/10 rounded-full"
                                                >
                                                    <Icons.cross className="h-6 w-6 sm:h-4 sm:w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* input */}

            <form
                onSubmit={handleSubmit}
                className="h-full flex justify-center items-center m-3"
            >
                <div className="w-full flex flex-col gap-5 items-center sm:mb-3">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full outline-none p-2 sm:p-1 text-lg sm:text-sm border border-(--border-color) rounded-xl sm:rounded-lg"
                        type="text"
                        title="input"
                        placeholder="Write a comment"
                    />
                    <button
                        type="submit"
                        disabled={!text.trim()}
                        className="w-full rounded-lg p-2 font-bold bg-white text-black text-lg sm:text-sm"
                    >
                        {loading ? <Loading2 /> : <span>Post</span>}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default Comment;
