<?php

namespace App\Controllers;

use App\Models\GameModel;
use App\Utils\Response;
use App\Middleware\AuthMiddleware;

class GameController {
    private GameModel $gameModel;

    public function __construct() {
        $this->gameModel = new GameModel();
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
        $games = $this->gameModel->getAllGames();
        Response::json($games);
    }

    public function show($id) {
        $game = $this->gameModel->getGameById($id);
        if ($game) {
            Response::json($game);
        } else {
            Response::error("Game not found", 404);
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
            $id = $this->gameModel->create($input);
            $game = $this->gameModel->getGameById($id);
            Response::json($game, 201);
        } catch (\Exception $e) {
            Response::error('Ошибка при создании игры: ' . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        if (!$this->checkAuth()) {
            return; // Response уже отправлен в middleware
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$this->gameModel->getGameById($id)) {
            Response::error("Game not found", 404);
        }

        try {
            $this->gameModel->update($id, $input);
            $game = $this->gameModel->getGameById($id);
            Response::json($game);
        } catch (\Exception $e) {
            Response::error('Ошибка при обновлении игры: ' . $e->getMessage(), 500);
        }
    }

    public function destroy($id) {
        if (!$this->checkAuth()) {
            return; // Response уже отправлен в middleware
        }

        if (!$this->gameModel->getGameById($id)) {
            Response::error("Game not found", 404);
        }

        try {
            $this->gameModel->delete($id);
            Response::json(['message' => 'Game deleted successfully']);
        } catch (\Exception $e) {
            Response::error('Ошибка при удалении игры: ' . $e->getMessage(), 500);
        }
    }
}