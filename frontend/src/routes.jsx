import React from "react";
import { Route, Routes, useParams } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ListPage from "./pages/ListPage.jsx";

function ListPageWrapper() {
    const { pageType } = useParams();
    return <ListPage key={pageType} chapterMenu={pageType} />;
}

function RoutesApp() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:pageType" element={<ListPageWrapper />} />
            <Route path="/admin" element={<AdminPage />} />
        </Routes>
    )
}

export default RoutesApp;