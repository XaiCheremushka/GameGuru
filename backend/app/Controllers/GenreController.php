<?php

namespace App\Controllers;

use App\Models\GenreModel;
use App\Utils\Response;

class GenreController {
    private GenreModel $genreModel;

    public function __construct() {
        $this->genreModel = new GenreModel();
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
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['name']) || !isset($input['slug'])) {
            Response::error('Name and slug are required', 400);
        }

        $id = $this->genreModel->create($input);
        $genre = $this->genreModel->getGenreById($id);
        Response::json($genre, 201);
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$this->genreModel->getGenreById($id)) {
            Response::error("Genre not found", 404);
        }

        $this->genreModel->update($id, $input);
        $genre = $this->genreModel->getGenreById($id);
        Response::json($genre);
    }

    public function destroy($id) {
        if (!$this->genreModel->getGenreById($id)) {
            Response::error("Genre not found", 404);
        }

        $this->genreModel->delete($id);
        Response::json(['message' => 'Genre deleted successfully']);
    }
}