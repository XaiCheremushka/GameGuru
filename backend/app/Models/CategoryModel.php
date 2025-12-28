<?php

namespace App\Models;

use App\Models\Database;
use PDO;

class CategoryModel {
    private PDO $db;
    private string $tableName = "categories";

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    public function getAllCategories() {
        $query = "SELECT * FROM " . $this->tableName;
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCategoryById($id) {
        $query = "SELECT * FROM " . $this->tableName . " WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->tableName . " (name, slug, short_description, long_description, image) 
                  VALUES (:name, :slug, :short_description, :long_description, :image) RETURNING id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':short_description', $data['short_description'] ?? null);
        $stmt->bindParam(':long_description', $data['long_description'] ?? null);
        $stmt->bindParam(':image', $data['image'] ?? null);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC)['id'];
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->tableName . " 
                  SET name = :name, slug = :slug, short_description = :short_description, 
                      long_description = :long_description, image = :image 
                  WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':short_description', $data['short_description'] ?? null);
        $stmt->bindParam(':long_description', $data['long_description'] ?? null);
        $stmt->bindParam(':image', $data['image'] ?? null);
        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->tableName . " WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}