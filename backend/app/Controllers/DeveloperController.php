<?php

namespace App\Controllers;

use App\Models\DeveloperModel;
use App\Utils\Response;
use App\Middleware\AuthMiddleware;

class DeveloperController {
    private DeveloperModel $developerModel;

    public function __construct() {
        $this->developerModel = new DeveloperModel();
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
        if (!$this->checkAuth()) {
            return; // Response уже отправлен в middleware
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['name']) || !isset($input['slug'])) {
            Response::error('Name and slug are required', 400);
        }

        try {
            $id = $this->developerModel->create($input);
            $developer = $this->developerModel->getDeveloperById($id);
            Response::json($developer, 201);
        } catch (\Exception $e) {
            Response::error('Ошибка при создании разработчика: ' . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        if (!$this->checkAuth()) {
            return; // Response уже отправлен в middleware
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$this->developerModel->getDeveloperById($id)) {
            Response::error("Developer not found", 404);
        }

        try {
            $this->developerModel->update($id, $input);
            $developer = $this->developerModel->getDeveloperById($id);
            Response::json($developer);
        } catch (\Exception $e) {
            Response::error('Ошибка при обновлении разработчика: ' . $e->getMessage(), 500);
        }
    }

    public function destroy($id) {
        if (!$this->checkAuth()) {
            return; // Response уже отправлен в middleware
        }

        if (!$this->developerModel->getDeveloperById($id)) {
            Response::error("Developer not found", 404);
        }

        try {
            $this->developerModel->delete($id);
            Response::json(['message' => 'Developer deleted successfully']);
        } catch (\Exception $e) {
            Response::error('Ошибка при удалении разработчика: ' . $e->getMessage(), 500);
        }
    }
}