import React from "react";
import authService from "../services/authService.js";
import apiService from "../services/api.js";
import ContentManager from "../components/admin/ContentManager.jsx";
import "../styles/css/admin-page.css";

class AdminPage extends React.Component {
    state = {
        isAuthenticated: false,
        loading: true,
        admin: null,
        activeTab: 'categories'
    };

    componentDidMount() {
        this.checkAuth();
    }

    checkAuth = async () => {
        const token = authService.getToken();
        
        if (!token) {
            window.location.href = '/admin/login';
            return;
        }

        try {
            const response = await apiService.verifyToken(token);
            this.setState({
                isAuthenticated: true,
                loading: false,
                admin: response.admin || authService.getAdmin()
            });
        } catch (error) {
            authService.logout();
            window.location.href = '/admin/login';
        }
    };

    handleLogout = () => {
        authService.logout();
        window.location.href = '/admin/login';
    };

    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
    };

    render() {
        const { loading, isAuthenticated, admin, activeTab } = this.state;

        if (loading) {
            return (
                <div className="admin-loading-screen">
                    Проверка авторизации...
                </div>
            );
        }

        if (!isAuthenticated) {
            return null;
        }

        const tabs = [
            { id: 'categories', label: 'Категории', apiMethod: apiService.getCategories, createMethod: apiService.createCategory, updateMethod: apiService.updateCategory, deleteMethod: apiService.deleteCategory },
            { id: 'genres', label: 'Жанры', apiMethod: apiService.getGenres, createMethod: apiService.createGenre, updateMethod: apiService.updateGenre, deleteMethod: apiService.deleteGenre },
            { id: 'developers', label: 'Разработчики', apiMethod: apiService.getDevelopers, createMethod: apiService.createDeveloper, updateMethod: apiService.updateDeveloper, deleteMethod: apiService.deleteDeveloper },
            { id: 'games', label: 'Игры', apiMethod: apiService.getGames, createMethod: apiService.createGame, updateMethod: apiService.updateGame, deleteMethod: apiService.deleteGame }
        ];

        const activeTabConfig = tabs.find(t => t.id === activeTab);

        const columns = {
            categories: [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Название' },
                { key: 'slug', label: 'Slug' },
                { 
                    key: 'short_description', 
                    label: 'Описание',
                    render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
                }
            ],
            genres: [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Название' },
                { key: 'slug', label: 'Slug' },
                { 
                    key: 'short_description', 
                    label: 'Описание',
                    render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
                }
            ],
            developers: [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Название' },
                { key: 'slug', label: 'Slug' },
                { 
                    key: 'short_description', 
                    label: 'Описание',
                    render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
                }
            ],
            games: [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Название' },
                { key: 'slug', label: 'Slug' },
                { 
                    key: 'short_description', 
                    label: 'Описание',
                    render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
                }
            ]
        };

        return (
            <div className="admin-page">
                <div className="admin-header">
                    <div className="admin-header-info">
                        <h2>Админ панель</h2>
                        {admin && (
                            <p>{admin.email}</p>
                        )}
                    </div>
                    <div className="admin-header-actions">
                        <button 
                            className="admin-logout-btn"
                            onClick={this.handleLogout}
                        >
                            Выйти
                        </button>
                    </div>
                </div>

                <nav className="admin-nav">
                    <ul className="admin-nav-list">
                        {tabs.map(tab => (
                            <li key={tab.id} className="admin-nav-item">
                                <a
                                    href="#"
                                    className={`admin-nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.handleTabChange(tab.id);
                                    }}
                                >
                                    {tab.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="admin-content">
                    {activeTabConfig && (
                        <ContentManager
                            key={activeTab}
                            title={activeTabConfig.label}
                            apiMethod={activeTabConfig.apiMethod}
                            createMethod={activeTabConfig.createMethod}
                            updateMethod={activeTabConfig.updateMethod}
                            deleteMethod={activeTabConfig.deleteMethod}
                            columns={columns[activeTab]}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default AdminPage;