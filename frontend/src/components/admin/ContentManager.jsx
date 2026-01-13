import React from "react";
import apiService from "../../services/api.js";
import "../../styles/css/admin-content-manager.css";

class ContentManager extends React.Component {
    state = {
        items: [],
        loading: true,
        error: null,
        showModal: false,
        editingItem: null,
        uploadingImage: false,
        imagePreview: null,
        formData: {
            name: '',
            slug: '',
            short_description: '',
            long_description: '',
            image: '',
            developer_id: '',
            genre_id: '',
            category_id: ''
        },
        developers: [],
        genres: [],
        categories: []
    };

    componentDidMount() {
        this.loadItems();
        // Загружаем справочники для игр
        if (this.props.title === 'Игры') {
            this.loadReferenceData();
        }
    }

    componentDidUpdate(prevProps) {
        // Перезагружаем данные при смене таба
        if (prevProps.title !== this.props.title) {
            this.loadItems();
            if (this.props.title === 'Игры') {
                this.loadReferenceData();
            }
        }
    }

    loadItems = async () => {
        const { apiMethod } = this.props;
        if (!apiMethod) {
            console.error('apiMethod не определен');
            return;
        }
        
        this.setState({ loading: true, error: null });

        try {
            const data = await apiMethod();
            const itemsArray = Array.isArray(data) ? data : (data?.data || []);
            console.log('Загружено элементов:', itemsArray.length, itemsArray);
            
            // Принудительно обновляем состояние
            this.setState({ 
                items: itemsArray, 
                loading: false,
                error: null
            }, () => {
                console.log('Состояние обновлено, items:', this.state.items.length);
            });
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            this.setState({ 
                error: 'Ошибка при загрузке данных', 
                loading: false 
            });
        }
    };

    loadReferenceData = async () => {
        try {
            const [developers, genres, categories] = await Promise.all([
                apiService.getDevelopers(),
                apiService.getGenres(),
                apiService.getCategories()
            ]);
            this.setState({
                developers: Array.isArray(developers) ? developers : (developers?.data || []),
                genres: Array.isArray(genres) ? genres : (genres?.data || []),
                categories: Array.isArray(categories) ? categories : (categories?.data || [])
            });
        } catch (error) {
            console.error('Ошибка при загрузке справочников:', error);
        }
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prev => ({
            formData: {
                ...prev.formData,
                [name]: value
            }
        }));
    };

    handleCreate = () => {
        this.setState({
            editingItem: null,
            imagePreview: null,
            formData: {
                name: '',
                slug: '',
                short_description: '',
                long_description: '',
                image: '',
                developer_id: '',
                genre_id: '',
                category_id: ''
            },
            showModal: true
        });
    };

    handleEdit = (item) => {
        const imageUrl = item.image ? `/uploads/${item.image}` : null;
        this.setState({
            editingItem: item,
            imagePreview: imageUrl,
            formData: {
                name: item.name || '',
                slug: item.slug || '',
                short_description: item.short_description || '',
                long_description: item.long_description || '',
                image: item.image || '',
                developer_id: item.developer_id || '',
                genre_id: item.genre_id || '',
                category_id: item.category_id || ''
            },
            showModal: true
        });
    };

    handleDelete = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот элемент?')) {
            return;
        }

        const { deleteMethod } = this.props;
        try {
            await deleteMethod(id);
            this.loadItems();
        } catch (error) {
            alert('Ошибка при удалении');
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { createMethod, updateMethod } = this.props;
        const { editingItem, formData } = this.state;

        try {
            // Подготовка данных для отправки
            const submitData = { ...formData };
            
            // Преобразуем пустые строки в null для внешних ключей
            if (submitData.developer_id === '') submitData.developer_id = null;
            if (submitData.genre_id === '') submitData.genre_id = null;
            if (submitData.category_id === '') submitData.category_id = null;

            let result;
            if (editingItem) {
                console.log('Обновление элемента:', editingItem.id, submitData);
                result = await updateMethod(editingItem.id, submitData);
            } else {
                console.log('Создание нового элемента:', submitData);
                result = await createMethod(submitData);
            }
            console.log('Результат сохранения:', result);
            
            // Перезагружаем данные ПЕРЕД закрытием модального окна
            console.log('Перезагрузка данных после сохранения...');
            await this.loadItems();
            console.log('Данные перезагружены');
            
            // Закрываем модальное окно и сбрасываем форму ПОСЛЕ перезагрузки данных
            this.setState({ 
                showModal: false, 
                imagePreview: null,
                editingItem: null,
                formData: {
                    name: '',
                    slug: '',
                    short_description: '',
                    long_description: '',
                    image: '',
                    developer_id: '',
                    genre_id: '',
                    category_id: ''
                }
            });
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
            const errorMessage = error?.response?.data?.data?.error || error?.response?.data?.error || error?.message || 'Ошибка при сохранении';
            alert(errorMessage);
        }
    };

    generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    handleNameChange = (e) => {
        const name = e.target.value;
        this.setState(prev => ({
            formData: {
                ...prev.formData,
                name: name,
                slug: prev.formData.slug || this.generateSlug(name)
            }
        }));
    };

    handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Проверка типа файла
        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите изображение');
            return;
        }

        // Проверка размера (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Размер файла не должен превышать 5MB');
            return;
        }

        // Показываем превью
        const reader = new FileReader();
        reader.onloadend = () => {
            this.setState({ imagePreview: reader.result });
        };
        reader.readAsDataURL(file);

        // Определяем тип для загрузки на основе title
        const { title } = this.props;
        let uploadType = 'general';
        if (title === 'Категории') uploadType = 'categories';
        else if (title === 'Жанры') uploadType = 'genres';
        else if (title === 'Разработчики') uploadType = 'developers';
        else if (title === 'Игры') uploadType = 'games';

        this.setState({ uploadingImage: true });

        try {
            const response = await apiService.uploadFile(file, uploadType);
            this.setState(prev => ({
                formData: {
                    ...prev.formData,
                    image: response.path
                },
                uploadingImage: false
            }));
        } catch (error) {
            alert('Ошибка при загрузке изображения');
            this.setState({ uploadingImage: false, imagePreview: null });
        }
    };

    render() {
        const { title, columns = [] } = this.props;
        const { items = [], loading, error, showModal, editingItem, formData } = this.state;

        if (loading) {
            return <div className="admin-loading">Загрузка...</div>;
        }

        if (error) {
            return <div className="admin-error">{error}</div>;
        }

        return (
            <div className="admin-content-manager">
                <div className="admin-content-header">
                    <h2>{title}</h2>
                    <button className="admin-btn admin-btn-primary" onClick={this.handleCreate}>
                        + Добавить
                    </button>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key}>{col.label}</th>
                                ))}
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!items || items.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="admin-empty">
                                        Нет данных
                                    </td>
                                </tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.id}>
                                        {columns.map(col => (
                                            <td key={col.key}>
                                                {col.render ? col.render(item[col.key], item) : item[col.key]}
                                            </td>
                                        ))}
                                        <td>
                                            <button 
                                                className="admin-btn admin-btn-edit"
                                                onClick={() => this.handleEdit(item)}
                                            >
                                                Редактировать
                                            </button>
                                            <button 
                                                className="admin-btn admin-btn-delete"
                                                onClick={() => this.handleDelete(item.id)}
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="admin-modal-overlay" onClick={() => this.setState({ showModal: false, imagePreview: null })}>
                        <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="admin-modal-header">
                                <h3>{editingItem ? 'Редактировать' : 'Создать'}</h3>
                                <button 
                                    className="admin-modal-close"
                                    onClick={() => this.setState({ showModal: false, imagePreview: null })}
                                >
                                    ×
                                </button>
                            </div>
                            <form onSubmit={this.handleSubmit} className="admin-form">
                                <div className="admin-form-group">
                                    <label>Название *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={this.handleNameChange}
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label>Slug *</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label>Краткое описание</label>
                                    <textarea
                                        name="short_description"
                                        value={formData.short_description}
                                        onChange={this.handleInputChange}
                                        rows="3"
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label>Полное описание</label>
                                    <textarea
                                        name="long_description"
                                        value={formData.long_description}
                                        onChange={this.handleInputChange}
                                        rows="5"
                                    />
                                </div>
                                {this.props.title === 'Игры' && (
                                    <>
                                        <div className="admin-form-group">
                                            <label>Разработчик</label>
                                            <select
                                                name="developer_id"
                                                value={formData.developer_id}
                                                onChange={this.handleInputChange}
                                            >
                                                <option value="">Не выбран</option>
                                                {this.state.developers.map(dev => (
                                                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="admin-form-group">
                                            <label>Жанр</label>
                                            <select
                                                name="genre_id"
                                                value={formData.genre_id}
                                                onChange={this.handleInputChange}
                                            >
                                                <option value="">Не выбран</option>
                                                {this.state.genres.map(genre => (
                                                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="admin-form-group">
                                            <label>Категория</label>
                                            <select
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={this.handleInputChange}
                                            >
                                                <option value="">Не выбрана</option>
                                                {this.state.categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                                <div className="admin-form-group">
                                    <label>Изображение</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={this.handleImageChange}
                                        disabled={this.state.uploadingImage}
                                        className="admin-file-input"
                                    />
                                    {this.state.uploadingImage && (
                                        <div className="admin-upload-status">Загрузка...</div>
                                    )}
                                    {this.state.imagePreview && (
                                        <div className="admin-image-preview">
                                            <img src={this.state.imagePreview} alt="Preview" />
                                            {formData.image && (
                                                <div className="admin-image-path">
                                                    Путь: {formData.image}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {!this.state.imagePreview && formData.image && (
                                        <div className="admin-image-path">
                                            Текущее изображение: {formData.image}
                                        </div>
                                    )}
                                </div>
                                <div className="admin-form-actions">
                                    <button 
                                        type="button" 
                                        className="admin-btn admin-btn-secondary"
                                        onClick={() => this.setState({ showModal: false, imagePreview: null })}
                                    >
                                        Отмена
                                    </button>
                                    <button type="submit" className="admin-btn admin-btn-primary">
                                        {editingItem ? 'Сохранить' : 'Создать'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ContentManager;

