// frontend/src/pages/HomePage.jsx
import React, { useEffect } from "react";
import AnimatedBackground from "../components/client/AnimatedBackground.jsx";
import "../styles/css/home-page.css"

function HomePage() {
    useEffect(() => {
        const title = "GameGuru — Каталог компьютерных игр";
        const description = "GameGuru — каталог компьютерных игр. Обзоры, жанры, разработчики и категории для удобного поиска и выбора игр.";
        document.title = title;
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', description);
    }, []);

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
