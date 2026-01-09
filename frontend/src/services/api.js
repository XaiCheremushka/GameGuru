import axios from 'axios';

// Базовый URL для API
const API_BASE_URL = '/api/v1';

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API сервис для работы с категориями, жанрами, разработчиками и играми
 */
export const apiService = {
  /**
   * Получить все категории
   */
  async getCategories() {
    try {
      const response = await apiClient.get('/categories');
      // API возвращает {success: true, data: [...]}, извлекаем data
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
      throw error;
    }
  },

  /**
   * Получить категорию по ID
   */
  async getCategoryById(id) {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Ошибка при загрузке категории ${id}:`, error);
      throw error;
    }
  },

  /**
   * Получить все жанры
   */
  async getGenres() {
    try {
      const response = await apiClient.get('/genres');
      // API возвращает {success: true, data: [...]}, извлекаем data
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Ошибка при загрузке жанров:', error);
      throw error;
    }
  },

  /**
   * Получить жанр по ID
   */
  async getGenreById(id) {
    try {
      const response = await apiClient.get(`/genres/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Ошибка при загрузке жанра ${id}:`, error);
      throw error;
    }
  },

  /**
   * Получить всех разработчиков
   */
  async getDevelopers() {
    try {
      const response = await apiClient.get('/developers');
      // API возвращает {success: true, data: [...]}, извлекаем data
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Ошибка при загрузке разработчиков:', error);
      throw error;
    }
  },

  /**
   * Получить разработчика по ID
   */
  async getDeveloperById(id) {
    try {
      const response = await apiClient.get(`/developers/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Ошибка при загрузке разработчика ${id}:`, error);
      throw error;
    }
  },

  /**
   * Получить все игры
   */
  async getGames() {
    try {
      const response = await apiClient.get('/games');
      // API возвращает {success: true, data: [...]}, извлекаем data
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Ошибка при загрузке игр:', error);
      throw error;
    }
  },

  /**
   * Получить игру по ID
   */
  async getGameById(id) {
    try {
      const response = await apiClient.get(`/games/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Ошибка при загрузке игры ${id}:`, error);
      throw error;
    }
  },

  /**
   * Авторизация админа
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Ошибка при входе:', error);
      throw error;
    }
  },

  /**
   * Проверить токен
   */
  async verifyToken(token) {
    try {
      const response = await apiClient.get('/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Ошибка при проверке токена:', error);
      throw error;
    }
  },

  // ========== АДМИН МЕТОДЫ (требуют авторизации) ==========

  /**
   * Создать категорию
   */
  async createCategory(data) {
    return this._adminRequest('post', '/admin/categories', data);
  },

  /**
   * Обновить категорию
   */
  async updateCategory(id, data) {
    return this._adminRequest('put', `/admin/categories/${id}`, data);
  },

  /**
   * Удалить категорию
   */
  async deleteCategory(id) {
    return this._adminRequest('delete', `/admin/categories/${id}`);
  },

  /**
   * Создать жанр
   */
  async createGenre(data) {
    return this._adminRequest('post', '/admin/genres', data);
  },

  /**
   * Обновить жанр
   */
  async updateGenre(id, data) {
    return this._adminRequest('put', `/admin/genres/${id}`, data);
  },

  /**
   * Удалить жанр
   */
  async deleteGenre(id) {
    return this._adminRequest('delete', `/admin/genres/${id}`);
  },

  /**
   * Создать разработчика
   */
  async createDeveloper(data) {
    return this._adminRequest('post', '/admin/developers', data);
  },

  /**
   * Обновить разработчика
   */
  async updateDeveloper(id, data) {
    return this._adminRequest('put', `/admin/developers/${id}`, data);
  },

  /**
   * Удалить разработчика
   */
  async deleteDeveloper(id) {
    return this._adminRequest('delete', `/admin/developers/${id}`);
  },

  /**
   * Создать игру
   */
  async createGame(data) {
    return this._adminRequest('post', '/admin/games', data);
  },

  /**
   * Обновить игру
   */
  async updateGame(id, data) {
    return this._adminRequest('put', `/admin/games/${id}`, data);
  },

  /**
   * Удалить игру
   */
  async deleteGame(id) {
    return this._adminRequest('delete', `/admin/games/${id}`);
  },

  /**
   * Загрузить файл
   */
  async uploadFile(file, type = 'general') {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      throw new Error('Токен не найден');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      throw error;
    }
  },

  /**
   * Вспомогательный метод для админ запросов с авторизацией
   */
  async _adminRequest(method, url, data = null) {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      throw new Error('Токен не найден');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    try {
      let response;
      switch (method.toLowerCase()) {
        case 'post':
          response = await apiClient.post(url, data, config);
          break;
        case 'put':
          response = await apiClient.put(url, data, config);
          break;
        case 'delete':
          response = await apiClient.delete(url, config);
          break;
        default:
          throw new Error(`Неподдерживаемый метод: ${method}`);
      }
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Ошибка при ${method} запросе:`, error);
      throw error;
    }
  },
};

export default apiService;

