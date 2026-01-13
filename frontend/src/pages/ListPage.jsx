import React from "react";
import ElementCard from "../components/client/ElementCard.jsx";
import apiService from "../services/api.js";
import "../styles/css/list-page.css";
import "../styles/css/scrollbar.css";

class ListPage extends React.Component {
    state = {
        activeCardId: null,
        items: [],
        loading: true,
        error: null
    };

    apiMethods = {
        categories: apiService.getCategories,
        genres: apiService.getGenres,
        developers: apiService.getDevelopers,
        games: apiService.getGames
    };

    componentDidMount() {
        this.setPageMeta(this.props.chapterMenu);
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.chapterMenu !== this.props.chapterMenu) {
            this.setPageMeta(this.props.chapterMenu);
            this.loadData();
        }
    }

    setPageMeta = (chapter) => {
        const mapping = {
            categories: {
                title: "Категории — GameGuru",
                description: "Категории игр на GameGuru: удобная навигация по типам и подборкам."
            },
            genres: {
                title: "Жанры — GameGuru",
                description: "Жанры игр: экшен, RPG, стратегия и другие — подборки и описания."
            },
            developers: {
                title: "Разработчики — GameGuru",
                description: "Разработчики игр: информация о студиях и авторах проектов."
            },
            games: {
                title: "Игры — GameGuru",
                description: "Список игр: описания, изображения и ссылки на дополнительные материалы."
            }
        };

        const meta = mapping[chapter] || { title: "GameGuru", description: "Каталог компьютерных игр." };
        document.title = meta.title;
        let tag = document.querySelector('meta[name="description"]');
        if (!tag) {
            tag = document.createElement('meta');
            tag.name = 'description';
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', meta.description);
    };

    loadData = async () => {
        const { chapterMenu } = this.props;
        const apiMethod = this.apiMethods[chapterMenu];

        if (!apiMethod) {
            this.setState({
                items: [],
                loading: false,
                error: 'Неизвестный тип данных'
            });
            return;
        }

        this.setState({ loading: true, error: null });

        try {
            const data = await apiMethod();
            const adaptedData = this.adaptData(data);
            this.setState({
                items: adaptedData,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            this.setState({
                items: [],
                loading: false,
                error: 'Не удалось загрузить данные с сервера'
            });
        }
    };

    adaptData = (data) => {
        if (!Array.isArray(data)) {
            return [];
        }

        return data.map((item) => {
            const title = item.name || item.title || 'Без названия';

            let description;
            if (item.short_description || item.long_description) {
                description = {
                    short: item.short_description || item.long_description || 'Описание отсутствует',
                    full: item.long_description || item.short_description || 'Описание отсутствует'
                };
            } else if (typeof item.description === 'object' && item.description !== null) {
                description = item.description;
            } else if (typeof item.description === 'string') {
                const shortDesc = item.description.length > 100
                    ? item.description.substring(0, 100) + '...'
                    : item.description;
                description = {
                    short: shortDesc,
                    full: item.description
                };
            } else {
                description = {
                    short: 'Описание отсутствует',
                    full: 'Описание отсутствует'
                };
            }

            let img = item.image || item.image_url || item.img || null;

            if (img) {
                if (img.startsWith('http://') || img.startsWith('https://')) {
                }
                else if (img.startsWith('/')) {
                }
                else {
                    img = `/uploads/${img}`;
                }
            }

            return {
                id: item.id,
                title: title,
                description: description,
                img: img
            };
        });
    };

    handleCardClick = (id) => {
        const blockContent = document.querySelector(".content-element-list");
        if (!blockContent.classList.contains('single-card-mode')) {
            const listTop = (id-1)*(150 + 10);
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
        const { activeCardId, items, loading, error } = this.state;

        if (loading) {
            return (
                <div className="content-element-list scrollbar">
                    <div style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: '#fff'
                    }}>
                        Загрузка данных...
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="content-element-list scrollbar">
                    <div style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: '#ff6b6b'
                    }}>
                        {error}
                    </div>
                </div>
            );
        }

        if (!items || items.length === 0) {
            return (
                <div className="content-element-list scrollbar">
                    <div style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: '#fff'
                    }}>
                        Данные отсутствуют
                    </div>
                </div>
            );
        }

        return (
            <div className={`content-element-list ${activeCardId !== null ? 'single-card-mode' : 'scrollbar'}`}>
                {items.map((item, index) => (
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
