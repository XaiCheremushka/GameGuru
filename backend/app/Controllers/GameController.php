<?php

namespace App\Controllers;

use App\Models\GameModel;
use App\Utils\Response;
class GameController {
    private GameModel $gameModel;

    public function __construct() {
        $this->gameModel = new GameModel();
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
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['name']) || !isset($input['slug'])) {
            Response::error('Name and slug are required', 400);
        }

        $id = $this->gameModel->create($input);
        $game = $this->gameModel->getGameById($id);
        Response::json($game, 201);
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$this->gameModel->getGameById($id)) {
            Response::error("Game not found", 404);
        }

        $this->gameModel->update($id, $input);
        $game = $this->gameModel->getGameById($id);
        Response::json($game);
    }

    public function destroy($id) {
        if (!$this->gameModel->getGameById($id)) {
            Response::error("Game not found", 404);
        }

        $this->gameModel->delete($id);
        Response::json(['message' => 'Game deleted successfully']);
    }
}