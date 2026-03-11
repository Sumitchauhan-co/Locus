import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import api from '../api/axios';
import axios from 'axios';
import { SiReactivex } from 'react-icons/si';

interface Post {
    _id: string;
    mediaURL: string;
    mediaType: string;
    caption: string;
}

const Posts: React.FC = () => {
    const [posts, setPosts] = useState<Array<Post>>([]);

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/api/post/');
                setPosts(res.data.posts || []);
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
        <section className="h-fit w-full flex flex-col items-center ">
            <div className="w-full grid content-center mb-10">
                <div className="text-4xl sm:text-5xl flex flex-col px-3 text-center text-(--text-color) font-[cursive]">
                    <h1>Your amazing posts,</h1>
                    <h1>for everyone!</h1>
                </div>
            </div>

            <div className="h-fit w-full py-2 sm:py-10 text-center">
                <h2 className="text-pink-500 text-4xl sm:text-5xl font-semibold">
                    Posts
                </h2>
            </div>

            {posts.length > 0 ? (
                <div className="flex-1 h-screen w-full relative max-w-6xl sm:py-4 px-4">
                    {/* scroll-smooth overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] */}
                    <div className="sm:hidden sticky h-[7vh] w-full bg-transparent/50 backdrop-blur-lg z-2 top-0"></div>
                    <div
                        className="h-fit w-full grid gap-6
                    grid-cols-1
                    x-sm:grid-cols-2
                    sm:grid-cols-3
                    md:grid-cols-4"
                    >
                        {posts?.map((post) => (
                            <div
                                key={post._id}
                                className="h-fit border break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="h-full w-full">
                                    {post.mediaType === 'video' && (
                                        <video
                                            muted
                                            loop
                                            controls
                                            src={post.mediaURL}
                                            className="w-full sm:aspect-square aspect-4/5 object-cover"
                                        ></video>
                                    )}
                                    {post.mediaType === 'image' && (
                                        <img
                                            src={post.mediaURL}
                                            loading="lazy"
                                            alt="Post"
                                            className="w-full sm:aspect-square aspect-4/5 object-cover"
                                        ></img>
                                    )}
                                </div>

                                <div className="p-3 text-lg sm:text-[1rem] text-center">
                                    {post.caption}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="sm:hidden sticky h-[7vh] w-full bg-transparent/50 backdrop-blur-lg z-2 bottom-0"></div>
                </div>
            ) : (
                <div className="h-fit w-full p-2 flex flex-col justify-center items-center gap-5 text-neutral-300">
                    <h3 className="x-sm:text-2xl md:text-3xl text-xl">
                        No posts yet!
                    </h3>
                    <div className="flex justify-center items-center gap-3">
                        <p className="x-sm:text-lg md:text-xl text-sm">
                            Try creating one...
                        </p>
                        <Button className="font-semibold" />
                    </div>
                </div>
            )}
        </section>
    );
};

export default Posts;
