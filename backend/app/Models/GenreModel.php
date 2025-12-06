<?php

namespace App\Models;

use Database;

class GenreModel {

    private $db;
    private string $tableName = "genres";

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function getAllGenres() {
        $query = "SELECT * FROM " . $this->tableName;
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getGenreById($id) {
        $query = "SELECT * FROM " . $this->tableName . " WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}