import React from "react";
import ElementCard from "../components/client/ElementCard.jsx";
import apiService from "../services/api.js";
import "../styles/css/list-page.css";
import "../styles/css/scrollbar.css";

class ListPage extends React.Component {
    state = {
        activeCardId: null, // Храним ID активной карточки
        items: [], // Данные, загруженные с сервера
        loading: true, // Состояние загрузки
        error: null // Ошибка загрузки
    };

    // Маппинг типов данных на методы API
    apiMethods = {
        categories: apiService.getCategories,
        genres: apiService.getGenres,
        developers: apiService.getDevelopers,
        games: apiService.getGames
    };

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        // Если изменился тип данных (categories/genres/developers/games), загружаем новые данные
        if (prevProps.chapterMenu !== this.props.chapterMenu) {
            this.loadData();
        }
    }

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
            // Преобразуем данные из API в формат, который ожидает ElementCard
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

    // Адаптер для преобразования данных из API в формат ElementCard
    adaptData = (data) => {
        if (!Array.isArray(data)) {
            return [];
        }

        return data.map((item) => {
            // Определяем название 
            const title = item.name || item.title || 'Без названия';
            
            // Определяем описание
            let description;
            // Если есть short_description и long_description (формат API)
            if (item.short_description || item.long_description) {
                description = {
                    short: item.short_description || item.long_description || 'Описание отсутствует',
                    full: item.long_description || item.short_description || 'Описание отсутствует'
                };
            }
            // Если описание уже объект с short/full
            else if (typeof item.description === 'object' && item.description !== null) {
                description = item.description;
            }
            // Если описание строка
            else if (typeof item.description === 'string') {
                const shortDesc = item.description.length > 100 
                    ? item.description.substring(0, 100) + '...' 
                    : item.description;
                description = {
                    short: shortDesc,
                    full: item.description
                };
            }
            // Если описания нет
            else {
                description = {
                    short: 'Описание отсутствует',
                    full: 'Описание отсутствует'
                };
            }

            // Определяем изображение (может быть image, image_url, img и т.д.)
            let img = item.image || item.image_url || item.img || null;
            
            // Если есть путь к изображению, формируем полный URL
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
        const { activeCardId, items, loading, error } = this.state;

        // Показываем индикатор загрузки
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

        // Показываем ошибку
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

        // Если данных нет
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