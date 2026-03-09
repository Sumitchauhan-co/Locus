import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import api from '../api/axios';
import axios from 'axios';

interface post {
    _id: string;
    imageID: string;
    caption: string;
}

const Posts: React.FC = () => {
    const [posts, setPosts] = useState<Array<post>>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/api/post/');
                setPosts(res.data.posts || []);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    console.log(err.response?.data);
                }
            }
        };
        fetchData();
    }, []);

    return (
        <section className="w-full flex flex-col justify-center items-center">
            <div className="w-full grid content-center mb-15">
                <div className="x-sm:text-4xl md:text-5xl text-3xl flex flex-col px-3 text-center text-(--text-color) font-[cursive]">
                    <h1>Your amazing posts,</h1>
                    <h1>for everyone!</h1>
                </div>
            </div>

            {posts?.length !== 0 ? (
                <div className="w-full relative max-w-6xl h-fit p-4 scroll-smooth overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div
                        className="grid gap-6
                    grid-cols-1
                    x-sm:grid-cols-2
                    sm:grid-cols-3
                    md:grid-cols-4
                    lg:grid-cols-5"
                    >
                        {posts?.map((post) => (
                            <div
                                key={post._id}
                                className="border break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <img
                                    src={post.imageID}
                                    alt="post"
                                    className="w-full aspect-square object-cover"
                                />

                                <div className="p-3 text-sm text-center">
                                    {post.caption}
                                </div>
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
