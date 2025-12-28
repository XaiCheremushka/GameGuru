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
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminPageLogIn;

