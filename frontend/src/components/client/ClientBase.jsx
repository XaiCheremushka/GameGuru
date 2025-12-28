import Header from "./Header.jsx";
import LeftNavigationMenu from "./LeftNavigationMenu.jsx";
import React from "react";
import HomePage from "../../pages/HomePage.jsx";
import ListPage from "../../pages/ListPage.jsx";


function ClientBase({props}) {
    return (
        <>
            <Header/>
            <div className="body-content">
                <LeftNavigationMenu />
                <main>
                    {
                        props.chapterMenu === "main" ?
                        <HomePage /> :
                        <ListPage key={props.pageType} chapterMenu={props.pageType} />
                    }
                </main>
            </div>
        </>
    )
}

export default ClientBase