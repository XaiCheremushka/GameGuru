import React from "react";
import {Outlet} from "react-router-dom";
import Header from "./components/Header";
import LeftNavigationMenu from "./components/LeftNavigationMenu";
import RoutesApp from "./routes";

import "./styles/css/general.css";

function App() {
    return (
        <div className="app">
            <Header />
            <div className="body-content">
                <LeftNavigationMenu />
                <main>
                    <Outlet /> {/* Здесь будет меняться содержимое страниц */}

                    <RoutesApp />  {/* Добавляем роутер */}
                </main>
            </div>
        </div>
    );
}

export default App;