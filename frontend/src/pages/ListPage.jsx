import React from "react";
import ElementCard from "../components/client/ElementCard.jsx";
import apiService from "../services/api.js";
import "../styles/css/list-page.css";
import "../styles/css/scrollbar.css";

class ListPage extends React.Component {
    state = {
        activeCardId: null,
        items: [],
        filteredItems: [],
        loading: true,
        error: null,
        showFilters: false,
        searchQuery: '',
        selectedGenre: '',
        selectedCategory: '',
        selectedDeveloper: '',
        genres: [],
        categories: [],
        developers: []
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
        if (this.props.chapterMenu === 'games') {
            this.loadFilterData();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.chapterMenu !== this.props.chapterMenu) {
            this.setPageMeta(this.props.chapterMenu);
            this.loadData();
            if (this.props.chapterMenu === 'games') {
                this.loadFilterData();
            } else {
                this.setState({ showFilters: false });
            }
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
                filteredItems: adaptedData,
                loading: false,
                error: null
            }, () => {
                if (this.props.chapterMenu === 'games') {
                    this.applyFilters();
                }
            });
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            this.setState({
                items: [],
                filteredItems: [],
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
                img: img,
                genre_id: item.genre_id,
                category_id: item.category_id,
                developer_id: item.developer_id
            };
        });
    };

    loadFilterData = async () => {
        try {
            const [genres, categories, developers] = await Promise.all([
                apiService.getGenres(),
                apiService.getCategories(),
                apiService.getDevelopers()
            ]);
            this.setState({
                genres: Array.isArray(genres) ? genres : (genres?.data || []),
                categories: Array.isArray(categories) ? categories : (categories?.data || []),
                developers: Array.isArray(developers) ? developers : (developers?.data || [])
            });
        } catch (error) {
            console.error('Ошибка при загрузке данных фильтров:', error);
        }
    };

    applyFilters = () => {
        const { items = [], searchQuery, selectedGenre, selectedCategory, selectedDeveloper, activeCardId } = this.state;
        
        if (!items || !Array.isArray(items)) {
            this.setState({ filteredItems: [] });
            return;
        }
        
        let filtered = [...items];

        // Поиск по названию
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(item => 
                item.title.toLowerCase().includes(query)
            );
        }

        // Фильтр по жанру
        if (selectedGenre) {
            filtered = filtered.filter(item => item.genre_id === parseInt(selectedGenre));
        }

        // Фильтр по категории
        if (selectedCategory) {
            filtered = filtered.filter(item => item.category_id === parseInt(selectedCategory));
        }

        // Фильтр по разработчику
        if (selectedDeveloper) {
            filtered = filtered.filter(item => item.developer_id === parseInt(selectedDeveloper));
        }

        // Если активная карточка не входит в отфильтрованный список, сбрасываем её
        const activeCardExists = filtered.some(item => (item.id || item.id === 0) && item.id === activeCardId);
        const newActiveCardId = activeCardExists ? activeCardId : null;

        this.setState({ 
            filteredItems: filtered,
            activeCardId: newActiveCardId
        });
    };

    handleFilterChange = (name, value) => {
        // Обновляем состояние и применяем фильтры, но не закрываем меню
        this.setState(prevState => {
            const newState = { [name]: value };
            // Применяем фильтры сразу с новым значением
            const { items = [] } = prevState;
            let filtered = [...items];
            
            // Используем новые значения для фильтрации
            const searchQuery = name === 'searchQuery' ? value : prevState.searchQuery;
            const selectedGenre = name === 'selectedGenre' ? value : prevState.selectedGenre;
            const selectedCategory = name === 'selectedCategory' ? value : prevState.selectedCategory;
            const selectedDeveloper = name === 'selectedDeveloper' ? value : prevState.selectedDeveloper;
            
            // Поиск по названию
            if (searchQuery && searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                filtered = filtered.filter(item => 
                    item.title && item.title.toLowerCase().includes(query)
                );
            }

            // Фильтр по жанру
            if (selectedGenre) {
                filtered = filtered.filter(item => item.genre_id === parseInt(selectedGenre));
            }

            // Фильтр по категории
            if (selectedCategory) {
                filtered = filtered.filter(item => item.category_id === parseInt(selectedCategory));
            }

            // Фильтр по разработчику
            if (selectedDeveloper) {
                filtered = filtered.filter(item => item.developer_id === parseInt(selectedDeveloper));
            }

            // Если активная карточка не входит в отфильтрованный список, сбрасываем её
            const activeCardExists = filtered.some(item => (item.id || item.id === 0) && item.id === prevState.activeCardId);
            const newActiveCardId = activeCardExists ? prevState.activeCardId : null;

            return {
                ...newState,
                filteredItems: filtered,
                activeCardId: newActiveCardId
            };
        });
    };

    toggleFilters = () => {
        this.setState(prev => ({ showFilters: !prev.showFilters }));
    };

    resetFilters = () => {
        this.setState({
            searchQuery: '',
            selectedGenre: '',
            selectedCategory: '',
            selectedDeveloper: ''
        }, () => {
            this.applyFilters();
        });
    };

    handleCardClick = (id) => {
        const blockContent = document.querySelector(".content-element-list");
        if (!blockContent.classList.contains('single-card-mode')) {
            // Находим индекс элемента в массиве filteredItems по id (используем filteredItems для правильного позиционирования)
            const itemIndex = this.state.filteredItems.findIndex(item => (item.id || item.id === 0) && item.id === id);
            const listTop = itemIndex >= 0 ? itemIndex * (150 + 10) : 0;
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
        const { activeCardId, filteredItems = [], loading, error, showFilters, searchQuery, selectedGenre, selectedCategory, selectedDeveloper, genres = [], categories = [], developers = [] } = this.state;
        const isGamesPage = this.props.chapterMenu === 'games';

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

        return (
            <>
                {(!filteredItems || filteredItems.length === 0) ? (
                    <div className="content-element-list scrollbar">
                        <div style={{
                            padding: '20px',
                            textAlign: 'center',
                            color: '#fff'
                        }}>
                            Данные отсутствуют
                        </div>
                    </div>
                ) : (
                    <div className={`content-element-list ${activeCardId !== null ? 'single-card-mode' : 'scrollbar'}`}>
                        {filteredItems.map((item, index) => (
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
                )}
                {isGamesPage && (
                    <>
                        <button 
                            className="games-filter-button"
                            onClick={this.toggleFilters}
                            aria-label="Открыть фильтры"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6H20M6 12H18M8 18H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>
                        {showFilters && (
                            <div className="games-filter-overlay" onClick={this.toggleFilters}>
                                <div className="games-filter-menu" onClick={(e) => e.stopPropagation()}>
                                    <button className="games-filter-close" onClick={this.toggleFilters}>×</button>
                                    <div className="games-filter-content">
                                        <div className="games-filter-group games-filter-search">
                                            <div className="games-filter-search-wrapper">
                                                <svg className="games-filter-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                <input
                                                    type="text"
                                                    placeholder="Введите название игры..."
                                                    value={searchQuery}
                                                    onChange={(e) => this.handleFilterChange('searchQuery', e.target.value)}
                                                    className="games-filter-input games-filter-search-input"
                                                />
                                            </div>
                                        </div>
                                        <div className="games-filter-group">
                                            <label>Жанр</label>
                                            <select
                                                value={selectedGenre}
                                                onChange={(e) => this.handleFilterChange('selectedGenre', e.target.value)}
                                                className="games-filter-select"
                                            >
                                                <option value="">Все жанры</option>
                                                {genres.map(genre => (
                                                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="games-filter-group">
                                            <label>Категория</label>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => this.handleFilterChange('selectedCategory', e.target.value)}
                                                className="games-filter-select"
                                            >
                                                <option value="">Все категории</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="games-filter-group">
                                            <label>Разработчик</label>
                                            <select
                                                value={selectedDeveloper}
                                                onChange={(e) => this.handleFilterChange('selectedDeveloper', e.target.value)}
                                                className="games-filter-select"
                                            >
                                                <option value="">Все разработчики</option>
                                                {developers.map(dev => (
                                                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="games-filter-actions">
                                            <button className="games-filter-reset" onClick={this.resetFilters}>
                                                Сбросить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </>
        );
    }
}

export default ListPage;
