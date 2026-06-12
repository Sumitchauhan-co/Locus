import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Applayout from '../layouts/AppLayout';
import Loading from '../components/Loading';
import Container from '../components/LayoutContainer';

// Lazy load the page components
const Home = lazy(() => import('../pages/Home'));
const PostCreate = lazy(() => import('../pages/PostCreate'));
const Menu = lazy(() => import('../pages/Menu'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Posts = lazy(() => import('../pages/Posts'));
const Map = lazy(() => import('../pages/Map'));

const PageLoader = () => (
    <Container>
        <Loading />
    </Container>
);

const AppRoute: React.FC = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route element={<Applayout />}>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/create-post"
                        element={<PostCreate />}
                    />
                    <Route
                        path="/about"
                        element={<About />}
                    />
                    <Route
                        path="/posts"
                        element={<Posts />}
                    />
                    <Route
                        path="/map"
                        element={<Map />}
                    />
                </Route>
                <Route
                    path="/menu"
                    element={<Menu />}
                />
                <Route
                    path="/contact"
                    element={<Contact />}
                />
            </Routes>
        </Suspense>
    );
};

export default AppRoute;
