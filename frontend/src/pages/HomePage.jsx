import React from "react";
import AnimatedBackground from "../components/client/AnimatedBackground.jsx";
import "../styles/css/home-page.css"

function HomePage() {
    return (
        <div className="home-page">
            <AnimatedBackground />
            <div className="content">
                <h1 className="title-h1">GameGuru</h1>
                <h2 className="title-h2">Сайт-каталог компьютерных игр</h2>
            </div>
        </div>
    )
}

export default HomePage;