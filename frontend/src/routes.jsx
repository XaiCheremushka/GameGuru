import React from "react";
import { Route, Routes, useParams } from "react-router-dom";
import ClientBase from "./components/client/ClientBase.jsx";
import AdminPage from "./pages/AdminPage.jsx";

function ListPageWrapper() {
    const { pageType } = useParams();
    return <ClientBase key={pageType} chapterMenu={pageType} />;
}

function AdminListPageWrapper() {
    const { pageType } = useParams();
    return <AdminPage key={pageType} chapterMenu={pageType} isAdminPage={true} />;
}

function RoutesApp() {
    return (
        <Routes>
            <Route path="/" element={<ClientBase chapterMenu={"main"}/>} />
            <Route path="/:pageType" element={<ListPageWrapper />} />
            <Route path="/admin" element={<AdminPage chapterMenu="dashboard" isAdminPage={true} />} />
            <Route path="/admin/:pageType" element={<AdminListPageWrapper />} />
        </Routes>
    )
}

export default RoutesApp;