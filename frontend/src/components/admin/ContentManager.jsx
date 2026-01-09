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
            image: ''
        }
    };

    componentDidMount() {
        this.loadItems();
    }

    loadItems = async () => {
        const { apiMethod } = this.props;
        this.setState({ loading: true, error: null });

        try {
            const data = await apiMethod();
            this.setState({ 
                items: Array.isArray(data) ? data : (data?.data || []), 
                loading: false 
            });
        } catch (error) {
            this.setState({ 
                error: 'Ошибка при загрузке данных', 
                loading: false 
            });
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
                image: ''
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
                image: item.image || ''
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
            if (editingItem) {
                await updateMethod(editingItem.id, formData);
            } else {
                await createMethod(formData);
            }
            this.setState({ showModal: false });
            this.loadItems();
        } catch (error) {
            alert('Ошибка при сохранении');
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
        const { title, columns } = this.props;
        const { items, loading, error, showModal, editingItem, formData } = this.state;

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
                            {items.length === 0 ? (
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

