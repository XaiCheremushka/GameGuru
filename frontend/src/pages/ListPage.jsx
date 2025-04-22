import React from "react";
import ElementCard from "../components/ElementCard.jsx";
import { categoriesList, developersList, genresList, gamesList } from "../data/ListData.jsx";
import "../styles/css/list-page.css";

class ListPage extends React.Component {
    listMap = {
        categories: categoriesList,
        genres: genresList,
        developers: developersList,
        games: gamesList
    };

    render() {
        const { chapterMenu } = this.props;
        const currentList = this.listMap[chapterMenu] || categoriesList;

        return (
            <div className="content-element-list">
                {currentList.map((item, index) => (
                    <ElementCard
                        key={index}
                        title={item.title}
                        description={item.description}
                        img={item.img ? item.img : null}
                    />
                ))}
            </div>
        );
    }
}

export default ListPage;