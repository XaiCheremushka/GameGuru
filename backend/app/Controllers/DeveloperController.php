<?php

namespace App\Controllers;

use App\Models\DeveloperModel;
use App\Utils\Response;
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

    public function store() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['name']) || !isset($input['slug'])) {
            Response::error('Name and slug are required', 400);
        }

        $id = $this->developerModel->create($input);
        $developer = $this->developerModel->getDeveloperById($id);
        Response::json($developer, 201);
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$this->developerModel->getDeveloperById($id)) {
            Response::error("Developer not found", 404);
        }

        $this->developerModel->update($id, $input);
        $developer = $this->developerModel->getDeveloperById($id);
        Response::json($developer);
    }

    public function destroy($id) {
        if (!$this->developerModel->getDeveloperById($id)) {
            Response::error("Developer not found", 404);
        }

        $this->developerModel->delete($id);
        Response::json(['message' => 'Developer deleted successfully']);
    }
}