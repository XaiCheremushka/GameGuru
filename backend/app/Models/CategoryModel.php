<?php

namespace App\Models;

class CategoryModel {
    private $db;
    private string $tableName = "categories";

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function getAllCategories() {
        $query = "SELECT * FROM " . $this->tableName;
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getCategoryById($id) {
        $query = "SELECT * FROM " . $this->tableName . " WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}