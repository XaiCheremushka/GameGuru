import Header from "./Header.jsx";
import LeftNavigationMenu from "./LeftNavigationMenu.jsx";
import React from "react";
import HomePage from "../../pages/HomePage.jsx";
import ListPage from "../../pages/ListPage.jsx";


function ClientBase({chapterMenu}) {
    return (
        <>
            <Header/>
            <div className="body-content">
                <LeftNavigationMenu />
                <main>
                    {
                        chapterMenu === "main" ?
                        <HomePage /> :
                        <ListPage key={chapterMenu} chapterMenu={chapterMenu} />
                    }
                </main>
            </div>
        </>
    )
}

export default ClientBase