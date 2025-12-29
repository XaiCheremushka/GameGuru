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
        
        $name = $data['name'] ?? '';
        $slug = $data['slug'] ?? '';
        $shortDescription = (!empty($data['short_description'])) ? $data['short_description'] : null;
        $longDescription = (!empty($data['long_description'])) ? $data['long_description'] : null;
        $image = (!empty($data['image'])) ? $data['image'] : null;
        $developerId = (!empty($data['developer_id'])) ? $data['developer_id'] : null;
        $genreId = (!empty($data['genre_id'])) ? $data['genre_id'] : null;
        $categoryId = (!empty($data['category_id'])) ? $data['category_id'] : null;
        
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':slug', $slug);
        $stmt->bindParam(':short_description', $shortDescription);
        $stmt->bindParam(':long_description', $longDescription);
        $stmt->bindParam(':image', $image);
        $stmt->bindParam(':developer_id', $developerId);
        $stmt->bindParam(':genre_id', $genreId);
        $stmt->bindParam(':category_id', $categoryId);
        
        if (!$stmt->execute()) {
            $errorInfo = $stmt->errorInfo();
            throw new \Exception('Ошибка при создании игры: ' . ($errorInfo[2] ?? 'Неизвестная ошибка'));
        }
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$result) {
            throw new \Exception('Не удалось получить ID созданной игры');
        }
        return $result['id'];
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->tableName . " 
                  SET name = :name, slug = :slug, short_description = :short_description, 
                      long_description = :long_description, image = :image, 
                      developer_id = :developer_id, genre_id = :genre_id, category_id = :category_id 
                  WHERE id = :id";
        $stmt = $this->db->prepare($query);
        
        $name = $data['name'] ?? '';
        $slug = $data['slug'] ?? '';
        $shortDescription = (!empty($data['short_description'])) ? $data['short_description'] : null;
        $longDescription = (!empty($data['long_description'])) ? $data['long_description'] : null;
        $image = (!empty($data['image'])) ? $data['image'] : null;
        $developerId = (!empty($data['developer_id'])) ? $data['developer_id'] : null;
        $genreId = (!empty($data['genre_id'])) ? $data['genre_id'] : null;
        $categoryId = (!empty($data['category_id'])) ? $data['category_id'] : null;
        
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':slug', $slug);
        $stmt->bindParam(':short_description', $shortDescription);
        $stmt->bindParam(':long_description', $longDescription);
        $stmt->bindParam(':image', $image);
        $stmt->bindParam(':developer_id', $developerId);
        $stmt->bindParam(':genre_id', $genreId);
        $stmt->bindParam(':category_id', $categoryId);
        
        if (!$stmt->execute()) {
            $errorInfo = $stmt->errorInfo();
            throw new \Exception('Ошибка при обновлении игры: ' . ($errorInfo[2] ?? 'Неизвестная ошибка'));
        }
        
        return true;
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->tableName . " WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}