import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import api from '../api/axios';
import axios from 'axios';
import {ScrollToTop} from '../components/ScrollTo.tsx';
import PostsFeed from '../components/PostsFeed.tsx';
import type { Post } from '../types/Posts.ts';
import Loading from '../components/Loading.tsx';

const Posts: React.FC = () => {
    const [posts, setPosts] = useState<Array<Post>>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await api.get('/api/post/');
                setPosts(res.data.posts);
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
        return <Loading />;
    }

    return (
        <section className="min-h-screen w-full flex flex-col items-center ">
            <ScrollToTop />
            <div className="w-full grid content-center mb-10">
                <div className="text-4xl sm:text-5xl flex flex-col p-3 text-center text-(--text-color)">
                    <h1>Your amazing posts,</h1>
                    <h1>for everyone!</h1>
                </div>
            </div>

            <div className="h-fit w-full py-2 sm:py-10 text-center sm:m-0 mb-10">
                <h2 className="text-pink-500 text-4xl sm:text-5xl tracking-[0.2rem]">
                    Posts
                </h2>
            </div>

            {posts.length > 0 ? (
                <PostsFeed
                    posts={posts}
                    setPosts={setPosts}
                />
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
