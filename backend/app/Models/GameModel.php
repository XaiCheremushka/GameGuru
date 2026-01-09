<?php

namespace App\Models;

use App\Models\Database;
use PDO;

class GameModel {
    private PDO $db;
    private string $tableName = "games";

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    public function getAllGames() {
        $query = "SELECT * FROM " . $this->tableName;
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getGameById($id) {
        $query = "SELECT * FROM " . $this->tableName . " WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->tableName . " (name, slug, short_description, long_description, image, developer_id, genre_id, category_id) 
                  VALUES (:name, :slug, :short_description, :long_description, :image, :developer_id, :genre_id, :category_id) RETURNING id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':short_description', $data['short_description'] ?? null);
        $stmt->bindParam(':long_description', $data['long_description'] ?? null);
        $stmt->bindParam(':image', $data['image'] ?? null);
        $developerId = !empty($data['developer_id']) ? $data['developer_id'] : null;
        $genreId = !empty($data['genre_id']) ? $data['genre_id'] : null;
        $categoryId = !empty($data['category_id']) ? $data['category_id'] : null;
        $stmt->bindParam(':developer_id', $developerId);
        $stmt->bindParam(':genre_id', $genreId);
        $stmt->bindParam(':category_id', $categoryId);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC)['id'];
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->tableName . " 
                  SET name = :name, slug = :slug, short_description = :short_description, 
                      long_description = :long_description, image = :image, 
                      developer_id = :developer_id, genre_id = :genre_id, category_id = :category_id 
                  WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':short_description', $data['short_description'] ?? null);
        $stmt->bindParam(':long_description', $data['long_description'] ?? null);
        $stmt->bindParam(':image', $data['image'] ?? null);
        $developerId = !empty($data['developer_id']) ? $data['developer_id'] : null;
        $genreId = !empty($data['genre_id']) ? $data['genre_id'] : null;
        $categoryId = !empty($data['category_id']) ? $data['category_id'] : null;
        $stmt->bindParam(':developer_id', $developerId);
        $stmt->bindParam(':genre_id', $genreId);
        $stmt->bindParam(':category_id', $categoryId);
        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->tableName . " WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}