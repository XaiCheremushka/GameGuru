<?php

namespace App\Controllers;

use App\Models\GameModel;
use Response;

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

}