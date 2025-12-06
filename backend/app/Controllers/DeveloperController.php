<?php

namespace App\Controllers;

use App\Models\DeveloperModel;

class DeveloperController {
    private DeveloperModel $developerModel;

    public function __construct() {
        $this->developerModel = new DeveloperModel();
    }

    public function index() {
        $developers = $this->developerModel->getAllDevelopers();
        Response::json($developers);
    }

    public function show($id) {
        $developer = $this->developerModel->getDeveloperById($id);
        if ($developer) {
            Response::json($developer);
        } else {
            Response::error("Developer not found", 404);
        }
    }
}