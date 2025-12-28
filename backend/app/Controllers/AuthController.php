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

