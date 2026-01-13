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
        // Установим метаданные страницы входа
        const title = "Вход в админ панель — GameGuru";
        const description = "Страница входа для администраторов сайта GameGuru. Вход по email/паролю или через Яндекс.";
        document.title = title;
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', description);

        // Проверяем, пришёл ли редирект от Yandex с токеном или ошибкой
        const params = new URLSearchParams(window.location.search);
        const yandexToken = params.get('yandex_token');
        const yandexError = params.get('yandex_error');

        if (yandexError) {
            this.setState({ error: decodeURIComponent(yandexError) });
            try { window.history.replaceState({}, document.title, window.location.pathname); } catch (e) {}
            return;
        }

        if (yandexToken) {
            this.setState({ loading: true, error: null });
            apiService.verifyToken(yandexToken)
                .then((response) => {
                    const admin = response.admin || response.data?.admin || null;
                    authService.setAuth(yandexToken, admin);
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

            authService.setAuth(response.token, response.admin);

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

    handleYandexLogin = (e) => {
        e.preventDefault();
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
                                    title="Email для входа в админ-панель"
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
                                    title="Пароль для входа в админ-панель"
                                />
                            </div>

                            <button
                                type="submit"
                                className="admin-login-button"
                                disabled={loading}
                                title="Войти"
                            >
                                {loading ? 'Вход...' : 'Войти'}
                            </button>

                            <div style={{ marginTop: '12px', textAlign: 'center' }}>
                                <button
                                    type="button"
                                    className="admin-login-button admin-login-button-yandex"
                                    onClick={this.handleYandexLogin}
                                    disabled={loading}
                                    title="Войти через Яндекс"
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
