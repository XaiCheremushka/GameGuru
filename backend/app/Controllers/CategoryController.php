<?php

namespace App\Controllers;

use App\Models\CategoryModel;
use App\Utils\Response;
use App\Middleware\AuthMiddleware;

class CategoryController {
    private CategoryModel $categoryModel;

    public function __construct() {
        $this->categoryModel = new CategoryModel();
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
        $categories = $this->categoryModel->getAllCategories();
        Response::json($categories);
    }

    public function show($id) {
        $category = $this->categoryModel->getCategoryById($id);
        if ($category) {
            Response::json($category);
        } else {
            Response::error("Category not found", 404);
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
            $id = $this->categoryModel->create($input);
            $category = $this->categoryModel->getCategoryById($id);
            Response::json($category, 201);
        } catch (\Exception $e) {
            Response::error('Ошибка при создании категории: ' . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        if (!$this->checkAuth()) {
            return; // Response уже отправлен в middleware
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$this->categoryModel->getCategoryById($id)) {
            Response::error("Category not found", 404);
        }

        try {
            $this->categoryModel->update($id, $input);
            $category = $this->categoryModel->getCategoryById($id);
            Response::json($category);
        } catch (\Exception $e) {
            Response::error('Ошибка при обновлении категории: ' . $e->getMessage(), 500);
        }
    }

    public function destroy($id) {
        if (!$this->checkAuth()) {
            return; // Response уже отправлен в middleware
        }

        if (!$this->categoryModel->getCategoryById($id)) {
            Response::error("Category not found", 404);
        }

        try {
            $this->categoryModel->delete($id);
            Response::json(['message' => 'Category deleted successfully']);
        } catch (\Exception $e) {
            Response::error('Ошибка при удалении категории: ' . $e->getMessage(), 500);
        }
    }
}