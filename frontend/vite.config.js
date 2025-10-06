import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  base: '/static/',
  build: {
    outDir: 'dist'
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8090'  // Настройка прокси для PHP-бэкенда
    }
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
})
