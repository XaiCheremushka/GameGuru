<?php

namespace App\Controllers;

use App\Models\GenreModel;

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
}