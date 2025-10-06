FROM node:24.9-slim AS builder

# Создаем пользователя внутри контейнера в Debian
RUN groupadd -r groupGameGuru && useradd -r -g groupGameGuru userGameGuru

# Создаем и переходим в рабочую директорию
WORKDIR /app/www/gameguru/client
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

USER userGameGuru