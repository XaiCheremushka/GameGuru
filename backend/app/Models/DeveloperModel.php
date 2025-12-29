<?php

namespace App\Models;

use App\Models\Database;
use PDO;

class DeveloperModel {
    private PDO $db;
    private string $tableName = "developers";

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    public function getAllDevelopers(): array {
        $query = "SELECT * FROM " . $this->tableName;
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getDeveloperById($id) {
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
        
        $name = $data['name'] ?? '';
        $slug = $data['slug'] ?? '';
        $shortDescription = (!empty($data['short_description'])) ? $data['short_description'] : null;
        $longDescription = (!empty($data['long_description'])) ? $data['long_description'] : null;
        $image = (!empty($data['image'])) ? $data['image'] : null;
        
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':slug', $slug);
        $stmt->bindParam(':short_description', $shortDescription);
        $stmt->bindParam(':long_description', $longDescription);
        $stmt->bindParam(':image', $image);
        
        if (!$stmt->execute()) {
            $errorInfo = $stmt->errorInfo();
            throw new \Exception('Ошибка при создании разработчика: ' . ($errorInfo[2] ?? 'Неизвестная ошибка'));
        }
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$result) {
            throw new \Exception('Не удалось получить ID созданного разработчика');
        }
        return $result['id'];
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->tableName . " 
                  SET name = :name, slug = :slug, short_description = :short_description, 
                      long_description = :long_description, image = :image 
                  WHERE id = :id";
        $stmt = $this->db->prepare($query);
        
        $name = $data['name'] ?? '';
        $slug = $data['slug'] ?? '';
        $shortDescription = (!empty($data['short_description'])) ? $data['short_description'] : null;
        $longDescription = (!empty($data['long_description'])) ? $data['long_description'] : null;
        $image = (!empty($data['image'])) ? $data['image'] : null;
        
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':slug', $slug);
        $stmt->bindParam(':short_description', $shortDescription);
        $stmt->bindParam(':long_description', $longDescription);
        $stmt->bindParam(':image', $image);
        
        if (!$stmt->execute()) {
            $errorInfo = $stmt->errorInfo();
            throw new \Exception('Ошибка при обновлении разработчика: ' . ($errorInfo[2] ?? 'Неизвестная ошибка'));
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