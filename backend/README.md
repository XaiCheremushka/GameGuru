# Backend — настройки и запуск

Этот раздел описывает обязательные переменные окружения и шаги для настройки входа через Яндекс (Yandex OAuth) для администраторов.

## Цель
Реализован вход в админ-панель через Yandex OAuth. Важно: только пользователи, чей email связан с записью в таблице `admins`, получат доступ в админку.

## Переменные окружения
Добавьте в ваше окружение (например, `.env` или переменные в Docker Compose) следующие значения:

- JWT_SECRET — секрет для подписи JWT (например: `jwt-secret-very-secret`)
- YANDEX_CLIENT_ID — ID приложения Yandex OAuth
- YANDEX_CLIENT_SECRET — Секрет приложения Yandex
- YANDEX_REDIRECT_URI — URL callback'а, который вы укажете в консоли Yandex. Пример: `https://your-backend.example.com/api/v1/auth/yandex/callback`
- FRONTEND_BASE_URL — Адрес фронтенда (например `https://your-frontend.example.com`). Используется для редиректа обратно на страницу входа: `FRONTEND_BASE_URL + /admin/login`.

Пример `.env`:

```
JWT_SECRET=jwt-secret-very-secret
YANDEX_CLIENT_ID=ваш-client-id
YANDEX_CLIENT_SECRET=ваш-client-secret
YANDEX_REDIRECT_URI=https://your-backend.example.com/api/v1/auth/yandex/callback
FRONTEND_BASE_URL=https://your-frontend.example.com
```

## Регистрация приложения в Yandex
1. Перейдите в консоль разработчика Yandex (OAuth-приложения).
2. Создайте новое приложение OAuth.
3. В поле Redirect URI укажите значение, совпадающее с `YANDEX_REDIRECT_URI` (пример: `https://your-backend.example.com/api/v1/auth/yandex/callback`).
4. Включите необходимые scope: `login:email` и `login:info`.
5. Сохраните `client_id` и `client_secret` — внесите их в `.env`.

## Зависимости PHP
Контроллер для JWT использует пакет `firebase/php-jwt`. Убедитесь, что он установлен в `backend`:

Выполните в папке `backend`:

```
composer require firebase/php-jwt
```

Также убедитесь, что у PHP включены расширения `json` и `pdo` (обычно по умолчанию в современных сборках PHP).

## Как это работает (кратко)
- На фронтенде в форме входа админа добавлена кнопка "Войти через Яндекс". Она перенаправляет на маршрут бэкенда `/api/v1/auth/yandex/redirect`.
- `AuthController::yandexRedirect()` формирует URL авторизации Yandex и делает редирект.
- После успешного входа у Yandex вызывается `YANDEX_REDIRECT_URI` — это `AuthController::yandexCallback()` на бэкенде.
- Контроллер обменивает код на `access_token`, получает email пользователя и ищет администратора с этим email в базе (`admins` table).
- Если админ найден — генерируется внутренний JWT и пользователь редиректится на фронтенд страницу логина с параметром `?yandex_token=...`.
- Фронтенд (`/admin/login`) перехватывает `yandex_token`, вызывает `/api/v1/auth/verify` для проверки токена, сохраняет токен и данные админа, и перенаправляет в админ-панель.
- Если email не найден или произошла ошибка — фронтенд получит `?yandex_error=...` и покажет сообщение об ошибке.

## Тестирование
1. Убедитесь, что в таблице `admins` есть запись с email, которым вы будете входить через Yandex.
2. Перейдите на `https://your-frontend.example.com/admin/login`.
3. Нажмите кнопку "Войти через Яндекс".
4. Завершите авторизацию через Yandex.
5. После редиректа вы либо окажетесь в админ-панели, либо увидите ошибку, если email не привязан к администратору.

## Замечания по безопасности
- В текущей реализации `state` для OAuth генерируется, но не сохраняется на сервере — это упрощение. В продакшне рекомендуется сохранять `state` (в сессии или базе) и проверять его в callback для защиты от CSRF.
- Убедитесь, что `YANDEX_REDIRECT_URI`, указанный в консоли Yandex, строго соответствует тому, что используется в `YANDEX_REDIRECT_URI`.
