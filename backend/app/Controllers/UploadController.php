<?php

namespace App\Controllers;

use App\Utils\Response;
use App\Middleware\AuthMiddleware;

class UploadController {
    private string $uploadDir;
    private array $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    private int $maxFileSize = 5 * 1024 * 1024; // 5MB

    public function __construct() {
        // Путь к директории uploads относительно корня проекта
        $this->uploadDir = __DIR__ . '/../../uploads/';
        // Убеждаемся, что директория существует
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
    }

    /**
     * Загрузить файл
     */
    public function upload() {
        // Проверка авторизации
        $authMiddleware = new AuthMiddleware();
        $adminId = $authMiddleware->handle();
        if (!$adminId) {
            return; // Response уже отправлен в middleware
        }

        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            Response::error('Файл не был загружен', 400);
        }

        $file = $_FILES['file'];
        $type = isset($_POST['type']) ? $_POST['type'] : 'general'; // categories, genres, developers, games

        // Проверка типа файла
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $this->allowedTypes)) {
            Response::error('Недопустимый тип файла. Разрешены только изображения (JPEG, PNG, GIF, WebP)', 400);
        }

        // Проверка размера
        if ($file['size'] > $this->maxFileSize) {
            Response::error('Файл слишком большой. Максимальный размер: 5MB', 400);
        }

        // Создать директорию если не существует
        $typeDir = $this->uploadDir . $type . '/';
        if (!is_dir($typeDir)) {
            mkdir($typeDir, 0755, true);
        }

        // Генерировать уникальное имя файла
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = uniqid() . '_' . time() . '.' . $extension;
        $filePath = $typeDir . $fileName;

        // Переместить файл
        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            Response::error('Ошибка при сохранении файла', 500);
        }

        // Вернуть путь относительно uploads
        $relativePath = $type . '/' . $fileName;
        Response::json([
            'path' => $relativePath,
            'url' => '/uploads/' . $relativePath
        ]);
    }
}

