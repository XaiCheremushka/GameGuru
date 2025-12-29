<?php

namespace App\Controllers;

use App\Models\AdminModel;
use App\Utils\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController {
    private AdminModel $adminModel;
    private string $jwtSecret;
    private int $jwtExpiration;

    public function __construct() {
        $this->adminModel = new AdminModel();
        $this->jwtSecret = $_ENV['JWT_SECRET'] ?? 'your-secret-key-change-in-production';
        $this->jwtExpiration = 3600 * 24; // 24 часа
    }

    /**
     * Вход в систему
     */
    public function login() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['email']) || !isset($input['password'])) {
            Response::error('Email и пароль обязательны', 400);
        }

        $email = $input['email'];
        $password = $input['password'];

        // Найти админа по email
        $admin = $this->adminModel->findByEmail($email);

        if (!$admin) {
            Response::error('Неверный email или пароль', 401);
        }

        // Проверить пароль
        if (!$this->adminModel->verifyPassword($password, $admin['password'])) {
            Response::error('Неверный email или пароль', 401);
        }

        // Создать JWT токен
        $token = $this->generateToken($admin['id'], $admin['email']);

        // Вернуть токен и информацию об админе (без пароля)
        Response::json([
            'token' => $token,
            'admin' => [
                'id' => $admin['id'],
                'email' => $admin['email'],
                'name' => $admin['name'] ?? null
            ]
        ]);
    }

    /**
     * Проверить токен
     */
    public function verify() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            Response::error('Токен не предоставлен', 401);
        }

        $token = $matches[1];

        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
            
            // Получить информацию об админе
            $admin = $this->adminModel->findById($decoded->admin_id);
            
            if (!$admin) {
                Response::error('Админ не найден', 401);
            }

            Response::json([
                'valid' => true,
                'admin' => $admin
            ]);
        } catch (\Exception $e) {
            Response::error('Недействительный токен', 401);
        }
    }

    /**
     * Редирект на Yandex OAuth (формируем URL и редиректим клиента)
     */
    public function yandexRedirect() {
        $clientId = $_ENV['YANDEX_CLIENT_ID'] ?? null;
        $redirectUri = $_ENV['YANDEX_REDIRECT_URI'] ?? null; // например https://your-backend.example.com/api/v1/auth/yandex/callback

        if (!$clientId || !$redirectUri) {
            Response::error('Настройки Yandex OAuth не заданы', 500);
        }

        $state = bin2hex(random_bytes(16));
        // Можно сохранять state в сесии/БД при необходимости. Для простоты — без хранения.

        $params = http_build_query([
            'response_type' => 'code',
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'state' => $state,
            'scope' => 'login:email login:info'
        ]);

        header('Location: https://oauth.yandex.ru/authorize?' . $params, true, 302);
        exit;
    }


    public function yandexCallback() {
        $code = $_GET['code'] ?? null;
        $state = $_GET['state'] ?? null;

        $clientId = $_ENV['YANDEX_CLIENT_ID'] ?? null;
        $clientSecret = $_ENV['YANDEX_CLIENT_SECRET'] ?? null;
        $redirectUri = $_ENV['YANDEX_REDIRECT_URI'] ?? null;

        $frontendLoginUrl = $_ENV['FRONTEND_BASE_URL'] ?? null; // например https://your-frontend.example.com
        if ($frontendLoginUrl) {
            $frontendLoginUrl = rtrim($frontendLoginUrl, '/') . '/admin/login';
        } else {
            // fallback — относительный путь
            $frontendLoginUrl = '/admin/login';
        }

        if (!$code || !$clientId || !$clientSecret || !$redirectUri) {
            $err = urlencode('Неверный запрос от провайдера');
            header("Location: {$frontendLoginUrl}?yandex_error={$err}", true, 302);
            exit;
        }

        // Обмен кода на access_token
        $tokenUrl = 'https://oauth.yandex.ru/token';
        $postData = http_build_query([
            'grant_type' => 'authorization_code',
            'code' => $code,
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri' => $redirectUri
        ]);

        $opts = [
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/x-www-form-urlencoded\r\n" .
                            "Content-Length: " . strlen($postData) . "\r\n",
                'content' => $postData,
                'timeout' => 10
            ]
        ];

        $context = stream_context_create($opts);
        $result = @file_get_contents($tokenUrl, false, $context);
        if ($result === false) {
            $err = urlencode('Ошибка при обмене кода на токен');
            header("Location: {$frontendLoginUrl}?yandex_error={$err}", true, 302);
            exit;
        }

        $tokenResp = json_decode($result, true);
        $accessToken = $tokenResp['access_token'] ?? null;
        if (!$accessToken) {
            $errMsg = $tokenResp['error_description'] ?? ($tokenResp['error'] ?? 'Не удалось получить access_token');
            $err = urlencode($errMsg);
            header("Location: {$frontendLoginUrl}?yandex_error={$err}", true, 302);
            exit;
        }

        // Получим информацию о пользователе
        $infoUrl = 'https://login.yandex.ru/info?format=json';
        $opts = [
            'http' => [
                'method' => 'GET',
                'header' => "Authorization: OAuth {$accessToken}\r\n",
                'timeout' => 10
            ]
        ];
        $context = stream_context_create($opts);
        $infoResult = @file_get_contents($infoUrl, false, $context);
        if ($infoResult === false) {
            $err = urlencode('Не удалось получить информацию о пользователе');
            header("Location: {$frontendLoginUrl}?yandex_error={$err}", true, 302);
            exit;
        }

        $info = json_decode($infoResult, true);
        $email = $info['default_email'] ?? $info['email'] ?? null;

        if (!$email) {
            $err = urlencode('Email не предоставлен провайдером');
            header("Location: {$frontendLoginUrl}?yandex_error={$err}", true, 302);
            exit;
        }

        // Проверяем, существует ли админ с таким email
        $admin = $this->adminModel->findByEmail($email);
        if (!$admin) {
            $err = urlencode('Доступ запрещен. Ваш email не привязан к администратору.');
            header("Location: {$frontendLoginUrl}?yandex_error={$err}", true, 302);
            exit;
        }

        // Создадим JWT для админа
        $token = $this->generateToken($admin['id'], $admin['email']);

        // Редиректим на фронтенд страницу логина с токеном
        $redirectUrl = $frontendLoginUrl . '?yandex_token=' . urlencode($token);
        header("Location: {$redirectUrl}", true, 302);
        exit;
    }

    /**
     * Сгенерировать JWT токен
     */
    private function generateToken(int $adminId, string $email): string {
        $issuedAt = time();
        $expiration = $issuedAt + $this->jwtExpiration;

        $payload = [
            'iss' => 'gameguru-api',
            'iat' => $issuedAt,
            'exp' => $expiration,
            'admin_id' => $adminId,
            'email' => $email
        ];

        return JWT::encode($payload, $this->jwtSecret, 'HS256');
    }
}
