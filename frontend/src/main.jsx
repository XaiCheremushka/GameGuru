import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

import "./styles/css/general.css";
import App from "./App.jsx";

// Устанавливаем CSS-переменную --vh, чтобы избежать проблем с 100vh на мобильных браузерах
function setVhVariable() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVhVariable();
window.addEventListener('resize', setVhVariable);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);