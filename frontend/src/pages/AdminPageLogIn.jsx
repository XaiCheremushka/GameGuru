import React from "react";
import apiService from "../services/api.js";
import authService from "../services/authService.js";
import "../styles/css/admin-login.css";

class AdminPageLogIn extends React.Component {
    state = {
        email: '',
        password: '',
        error: null,
        loading: false
    };

    componentDidMount() {
        // Проверяем, пришёл ли редирект от Yandex с токеном или ошибкой
        const params = new URLSearchParams(window.location.search);
        const yandexToken = params.get('yandex_token');
        const yandexError = params.get('yandex_error');

        if (yandexError) {
            // decodeURIComponent на случай, если сервер закодировал сообщение
            this.setState({ error: decodeURIComponent(yandexError) });
            // очищаем query string
            try { window.history.replaceState({}, document.title, window.location.pathname); } catch (e) {}
            return;
        }

        if (yandexToken) {
            // Попробуем верифицировать токен у API и сохранить данные
            this.setState({ loading: true, error: null });
            apiService.verifyToken(yandexToken)
                .then((response) => {
                    // response может содержать { valid: true, admin: {...} } или { admin: {...} }
                    const admin = response.admin || response.data?.admin || null;
                    // Сохраняем токен и информацию об админе
                    authService.setAuth(yandexToken, admin);
                    // очищаем query string и переадресуем на админ-панель
                    try { window.history.replaceState({}, document.title, window.location.pathname); } catch (e) {}
                    window.location.href = '/admin';
                })
                .catch((err) => {
                    console.error('Ошибка при верификации yandex token:', err);
                    this.setState({ error: 'Ошибка при авторизации через Яндекс', loading: false });
                    try { window.history.replaceState({}, document.title, window.location.pathname); } catch (e) {}
                });
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            error: null
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = this.state;

        if (!email || !password) {
            this.setState({ error: 'Заполните все поля' });
            return;
        }

        this.setState({ loading: true, error: null });

        try {
            const response = await apiService.login(email, password);

            // Сохранить токен и данные админа
            authService.setAuth(response.token, response.admin);

            // Перенаправить на админ панель
            window.location.href = '/admin';
        } catch (error) {
            const errorMessage = error.response?.data?.data?.error || 
                                error.response?.data?.error || 
                                'Ошибка при входе. Проверьте email и пароль.';
            this.setState({ 
                error: errorMessage,
                loading: false 
            });
        }
    };

    // Новая функция: запуск OAuth через редирект на бэкенд
    handleYandexLogin = (e) => {
        e.preventDefault();
        // Перенаправляем браузер на бэкенд, который делает редирект на Yandex
        window.location.href = '/api/v1/auth/yandex/redirect';
    };

    render() {
        const { email, password, error, loading } = this.state;

        return (
            <div className="admin-login-page">
                <div className="admin-login-container">
                    <div className="admin-login-card">
                        <h1 className="admin-login-title">Вход в админ панель</h1>
                        <form onSubmit={this.handleSubmit} className="admin-login-form">
                            {error && (
                                <div className="admin-login-error">
                                    {error}
                                </div>
                            )}

                            <div className="admin-login-field">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={this.handleChange}
                                    placeholder="admin@example.com"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="admin-login-field">
                                <label htmlFor="password">Пароль</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={this.handleChange}
                                    placeholder="Введите пароль"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="admin-login-button"
                                disabled={loading}
                            >
                                {loading ? 'Вход...' : 'Войти'}
                            </button>

                            {/* Кнопка входа через Яндекс */}
                            <div style={{ marginTop: '12px', textAlign: 'center' }}>
                                <button
                                    type="button"
                                    className="admin-login-button admin-login-button-yandex"
                                    onClick={this.handleYandexLogin}
                                    disabled={loading}
                                >
                                    Войти через Яндекс
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminPageLogIn;
