<?php
class Response {
    public static function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode([
            'success' => $statusCode < 400,
            'data' => $data
        ]);
        exit;
    }

    public static function error($message, $statusCode = 400) {
        self::json(['error' => $message], $statusCode);
    }
}