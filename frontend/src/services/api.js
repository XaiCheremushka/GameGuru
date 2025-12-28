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
};

export default apiService;

