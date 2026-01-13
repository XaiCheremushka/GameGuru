<?php

namespace App\Middleware;

use App\Utils\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware {
    private string $jwtSecret;

    public function __construct() {
        $this->jwtSecret = $_ENV['JWT_SECRET'] ?? 'your-secret-key-change-in-production';
    }

    /**
     * Проверить авторизацию
     */
    public function handle(): ?int {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            Response::error('Токен не предоставлен', 401);
            return null;
        }

        $token = $matches[1];

        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
            return $decoded->admin_id;
        } catch (\Exception $e) {
            Response::error('Недействительный токен', 401);
            return null;
        }
    }
}