<?php

namespace App\Controllers;

use App\Models\GenreModel;
use App\Utils\Response;
use App\Middleware\AuthMiddleware;

class GenreController {
    private GenreModel $genreModel;

    public function __construct() {
        $this->genreModel = new GenreModel();
    }

    private function checkAuth() {
        $authMiddleware = new AuthMiddleware();
        $adminId = $authMiddleware->handle();
        if (!$adminId) {
            return false; // Response уже отправлен в middleware
        }
        return true;
    }

    public function index() {
        $genres = $this->genreModel->getAllGenres();
        Response::json($genres);
    }

    public function show($id) {
        $genre = $this->genreModel->getGenreById($id);
        if ($genre) {
            Response::json($genre);
        } else {
            Response::error("Genre not found", 404);
        }
    }

    public function store() {
        if (!$this->checkAuth()) {
            return; // Response уже отправлен в middleware
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['name']) || !isset($input['slug'])) {
            Response::error('Name and slug are required', 400);
        }

        try {
            $id = $this->genreModel->create($input);
            $genre = $this->genreModel->getGenreById($id);
            Response::json($genre, 201);
        } catch (\Exception $e) {
            Response::error('Ошибка при создании жанра: ' . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        if (!$this->checkAuth()) {
            return; // Response уже отправлен в middleware
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$this->genreModel->getGenreById($id)) {
            Response::error("Genre not found", 404);
        }

        try {
            $this->genreModel->update($id, $input);
            $genre = $this->genreModel->getGenreById($id);
            Response::json($genre);
        } catch (\Exception $e) {
            Response::error('Ошибка при обновлении жанра: ' . $e->getMessage(), 500);
        }
    }

    public function destroy($id) {
        if (!$this->checkAuth()) {
            return; // Response уже отправлен в middleware
        }

        if (!$this->genreModel->getGenreById($id)) {
            Response::error("Genre not found", 404);
        }

        try {
            $this->genreModel->delete($id);
            Response::json(['message' => 'Genre deleted successfully']);
        } catch (\Exception $e) {
            Response::error('Ошибка при удалении жанра: ' . $e->getMessage(), 500);
        }
    }
}