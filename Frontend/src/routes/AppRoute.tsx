import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import PostCreate from '../pages/PostCreate';
import Menu from '../pages/Menu';
import Applayout from '../layouts/AppLayout';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Posts from '../pages/Posts';

const AppRoute: React.FC = () => {
    return (
        <Routes>
            <Route element={<Applayout />}>
                <Route
                    path="/"
                    element={<Home />}
                ></Route>
                <Route
                    path="/create-post"
                    element={<PostCreate />}
                ></Route>
                <Route
                    path="/about"
                    element={<About />}
                ></Route>

                <Route
                    path="/posts"
                    element={<Posts />}
                ></Route>
            </Route>
            <Route
                path="/menu"
                element={<Menu />}
            ></Route>
            <Route
                path="/contact"
                element={<Contact />}
            ></Route>
        </Routes>
    );
};

export default AppRoute;
