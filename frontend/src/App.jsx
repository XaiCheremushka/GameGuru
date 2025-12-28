import React from "react";
import {Outlet} from "react-router-dom";
import Header from "./components/client/Header.jsx";
import LeftNavigationMenu from "./components/client/LeftNavigationMenu.jsx";
import RoutesApp from "./routes";

import "./styles/css/general.css";

function App() {
    return (
        <div className="app">
            <Outlet /> {/* Здесь будет меняться содержимое страниц */}

            <RoutesApp />  {/* Добавляем роутер */}
        </div>
    );
}

export default App;