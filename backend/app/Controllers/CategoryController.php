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
}