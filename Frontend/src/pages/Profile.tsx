import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import Loading from '../components/Loading';
import PostsFeed from '../components/PostsFeed';
import { LoadingDots } from '../utils/LoadingDots';
import { ScrollToTop } from '../components/ScrollTo';
import { AuthContext } from '../contexts/AuthContext';
import { getBgColor } from '../utils/bgColor';
import api from '../api/axios';
import type { Post } from '../types/Posts';
import Pagination from '../components/Pagination';

const Profile: React.FC = () => {
	const { user } = useContext(AuthContext);
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		if (!user) {
			setLoading(false);
			return;
		}

		const fetchUserPosts = async () => {
			try {
				const response = await api.get('/api/post/paginate/user', {
					params: { page },
				});
				setPosts(response.data.posts);
				setTotalPages(response.data.totalPages);
			} catch (error: unknown) {
				if (axios.isAxiosError(error)) {
					console.log(error.response?.data);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchUserPosts();
	}, [user, page]);

	if (loading) {
		return (
			<Loading>
				<span className="flex items-center gap-1 text-sm text-neutral-300 sm:text-lg">
					Loading your profile <LoadingDots />
				</span>
			</Loading>
		);
	}

	if (!user) {
		return (
			<section className="flex min-h-screen w-full flex-col items-center justify-center gap-5 text-neutral-300">
				<h1 className="text-2xl sm:text-3xl">Log in to view your profile</h1>
				<Button text="Log in" />
			</section>
		);
	}

	const initial = user.username?.charAt(0).toUpperCase() || 'U';
	const bgColor = getBgColor(user.username || '');

	return (
		<section className="flex min-h-screen w-full flex-col items-center">
			<ScrollToTop />
			<header className="flex w-full max-w-7xl flex-col items-center gap-4 px-4 pb-8 pt-4 sm:flex-row sm:items-end sm:gap-6 sm:px-8">
				<div
					className={`flex h-15 w-15 shrink-0 items-center justify-center rounded-full border-2 border-white text-4xl font-bold text-(--text-color) shadow-lg ${bgColor}`}
					aria-hidden="true"
				>
					{initial}
				</div>
				<div className="text-center sm:text-left">
					<p className="text-sm uppercase tracking-[0.2rem] text-pink-400">
						Your space
					</p>
					<h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
						{user.username}
					</h1>
					<p className="mt-1 text-sm text-(--text-color2)">{user.email}</p>
				</div>
				<p className="sm:ml-auto text-sm text-(--text-color2)">
					{posts.length} {posts.length === 1 ? 'post' : 'posts'}
				</p>
			</header>

			<div className="w-full max-w-7xl border-y border-(--border-color2) px-4 py-5 sm:px-8">
				<h2 className="text-2xl tracking-[0.15rem] text-pink-500 sm:text-3xl">
					Your posts
				</h2>
			</div>

			{posts.length > 0 ? (
				<PostsFeed
					posts={posts}
					setPosts={setPosts}
				/>
			) : (
				<div className="flex w-full flex-col items-center justify-center gap-5 p-8 text-neutral-300">
					<h3 className="text-xl sm:text-2xl">
						You have not posted anything yet.
					</h3>
					<Button text="Create Post" />
				</div>
			)}
			<Pagination
				page={page}
				totalPages={totalPages}
				onPageChange={setPage}
			/>
		</section>
	);
};

export default Profile;
