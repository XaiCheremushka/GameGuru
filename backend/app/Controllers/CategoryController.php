<?php

namespace App\Controllers;

use App\Models\CategoryModel;
use App\Utils\Response;

class CategoryController {
    private CategoryModel $categoryModel;

    public function __construct() {
        $this->categoryModel = new CategoryModel();
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
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['name']) || !isset($input['slug'])) {
            Response::error('Name and slug are required', 400);
        }

        $id = $this->categoryModel->create($input);
        $category = $this->categoryModel->getCategoryById($id);
        Response::json($category, 201);
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$this->categoryModel->getCategoryById($id)) {
            Response::error("Category not found", 404);
        }

        $this->categoryModel->update($id, $input);
        $category = $this->categoryModel->getCategoryById($id);
        Response::json($category);
    }

    public function destroy($id) {
        if (!$this->categoryModel->getCategoryById($id)) {
            Response::error("Category not found", 404);
        }

        $this->categoryModel->delete($id);
        Response::json(['message' => 'Category deleted successfully']);
    }
}