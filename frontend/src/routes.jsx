import React from "react";
import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ListPage from "./pages/ListPage.jsx";

function RoutesApp() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories/" element={<ListPage chapterMenu="categories" />} />
            <Route path="/genres/" element={<ListPage chapterMenu="genres" />} />
            <Route path="/games/" element={<ListPage chapterMenu="games" />} />
            <Route path="/developers/" element={<ListPage chapterMenu="developers" />} />
        </Routes>
    )
}

export default RoutesApp;