import React from "react";
import ElementCard from "../components/ElementCard.jsx";
import { categoriesList, developersList, genresList, gamesList } from "../data/ListData.jsx";
import "../styles/css/list-page.css";
import "../styles/css/scrollbar.css";

class ListPage extends React.Component {
    state = {
        activeCardId: null // Храним ID активной карточки
    };

    listMap = {
        categories: categoriesList,
        genres: genresList,
        developers: developersList,
        games: gamesList
    };

    handleCardClick = (id) => {
        // При нажатии на кнопку сдвигаем весь div с карточками выше и увеличиваем высоту, чтобы карточка заняла весь экран
        const blockContent = document.querySelector(".content-element-list");
        if (!blockContent.classList.contains('single-card-mode')) {
            const listTop = id*(150 + 10);
            blockContent.style.setProperty(
                '--list-top-position',
                `${listTop}px`
            );
        } else {
            blockContent.style.setProperty(
                '--list-top-position',
                `0px`
            );
        }

        this.setState(prev => ({
            activeCardId: prev.activeCardId === id ? null : id
        }));
    };

    render() {
        const { chapterMenu } = this.props;
        const { activeCardId } = this.state;
        const currentList = this.listMap[chapterMenu] || categoriesList;

        console.log(this.state.activeCardId);

        return (
            <div className={`content-element-list ${activeCardId !== null ? 'single-card-mode' : 'scrollbar'}`}>
                {currentList.map((item, index) => (
                    <ElementCard
                        key={item.id || index}
                        id={item.id || index}
                        title={item.title}
                        description={item.description}
                        img={item.img}
                        isActive={activeCardId === (item.id || index)}
                        onClick={this.handleCardClick}
                    />
                ))}
            </div>
        );

    }
}

export default ListPage;