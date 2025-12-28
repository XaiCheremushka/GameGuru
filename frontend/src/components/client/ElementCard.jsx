import React, {useState} from "react";
import "../../styles/css/element-card.css";
import noPhoto from "../../assets/items/No_photo.svg";


const ElementCard = ({id, title, description, img, isActive, onClick}) => {
    return (
        <div
            className={`element-card-wrapper ${isActive ? 'element-card--active' : ''}`}
            onClick={() => onClick(id)}
            role="button"
            tabIndex={0}
            // style={isActive ? { minHeight: `calc(100% - ${id*(150 + 10)}px)` } : {}}
        >
            <img
                className="img-element-card"
                src={img || noPhoto}
                alt={title}
            />
            {isActive ? (
                <p className="description-element-card">{description.full}</p>
            ) : (
                <div className="description-element-card-wrapper">
                    <h3 className="title-element-card">{title}</h3>
                    <p className="description-element-card">{description.short}</p>
                </div>
            )}
        </div>
    );
};

ElementCard.defaultProps = {
    title: "Название",
    description: {
        short: "Описание"
    },
    img: noPhoto
}

export default ElementCard