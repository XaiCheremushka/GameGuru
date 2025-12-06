FROM php:8.2-fpm

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev

# Очищаем кеш
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Устанавливаем расширения PHP
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Устанавливаем Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Создаем рабочую директорию
WORKDIR /app/www/gameguru/backend

# Копируем composer.json и composer.lock отдельно (для кеширования)
COPY composer.json ./

# Устанавливаем зависимости (БЕЗ dev-зависимостей)
RUN composer install --no-dev --no-interaction --optimize-autoloader

# Копируем файлы проекта
COPY . .

# Устанавливаем права
RUN chown -R www-data:www-data /app/www/gameguru/backend/storage
RUN chmod -R 755 /app/www/gameguru/backend/storage

EXPOSE 9000

CMD ["php-fpm"]