/**
 * Сервис для работы с аутентификацией
 */

const TOKEN_KEY = 'admin_token';
const ADMIN_KEY = 'admin_data';

export const authService = {
  /**
   * Сохранить токен и данные админа
   */
  setAuth(token, admin) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  },

  /**
   * Получить токен
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Получить данные админа
   */
  getAdmin() {
    const adminData = localStorage.getItem(ADMIN_KEY);
    return adminData ? JSON.parse(adminData) : null;
  },

  /**
   * Проверить, авторизован ли админ
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Выйти из системы
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  }
};

export default authService;

