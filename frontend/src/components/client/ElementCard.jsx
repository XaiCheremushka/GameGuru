// javascript
// File: frontend/src/components/client/ElementCard.jsx
import React from "react";
import "../../styles/css/element-card.css";
import noPhoto from "../../assets/items/No_photo.svg";

const ElementCard = ({id, title, description, img, isActive, onClick}) => {
    const fullText = (description && description.full) ? description.full : '';
    // Разделяем по пустой строке (абзацам)
    const paragraphs = fullText
        .split(/\r?\n\s*\r?\n/) // разделитель: пустая строка
        .map(p => p.trim())
        .filter(Boolean);

    return (
        <div
            className={`element-card-wrapper ${isActive ? 'element-card--active' : ''}`}
            onClick={() => onClick(id)}
            role="button"
            tabIndex={0}
        >
            <img
                className="img-element-card"
                src={img || noPhoto}
                alt={title}
            />
            {isActive ? (
                <div className="description-element-card-wrapper">
                    {paragraphs.length > 0 ? paragraphs.map((p, i) => (
                        <p key={i} className="description-element-card">{p}</p>
                    )) : (
                        <p className="description-element-card">Описание отсутствует</p>
                    )}
                </div>
            ) : (
                <div className="description-element-card-wrapper">
                    <h3 className="title-element-card">{title}</h3>
                    <p className="description-element-card">{description?.short}</p>
                </div>
            )}
        </div>
    );
};

ElementCard.defaultProps = {
    title: "Название",
    description: {
        short: "Описание",
        full: ""
    },
    img: noPhoto
}

export default ElementCard;